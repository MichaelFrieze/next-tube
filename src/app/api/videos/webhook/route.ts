import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";

import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET is not set");
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature) {
    return new Response("No signature found", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": muxSignature,
    },
    SIGNING_SECRET,
  );

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }

      console.log("Creating video: ", { uploadId: data.upload_id });

      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0].id;

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      if (!playbackId) {
        return new Response("Missing playback ID", { status: 400 });
      }

      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      let thumbnailUrl: string;
      let thumbnailKey: string;
      let previewUrl: string;
      let previewKey: string;

      const utapi = new UTApi();
      const [uploadedThumbnail, uploadedPreview] =
        await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);

      if (!uploadedThumbnail.data || !uploadedPreview.data) {
        console.log("Error uploading thumbnail and preview to UploadThing.");

        thumbnailUrl = tempThumbnailUrl;
        thumbnailKey = `mux-thumbnail-key-${playbackId}`;
        previewUrl = tempPreviewUrl;
        previewKey = `mux-preview-key-${playbackId}`;
      } else {
        thumbnailUrl = uploadedThumbnail.data.appUrl;
        thumbnailKey = uploadedThumbnail.data.key;
        previewUrl = uploadedPreview.data.appUrl;
        previewKey = uploadedPreview.data.key;
      }

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl,
          thumbnailKey,
          previewUrl,
          previewKey,
          duration,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

      if (!data.upload_id) {
        return new Response("Missing upload ID", { status: 400 });
      }

      console.log("Deleting video: ", { uploadId: data.upload_id });

      // Delete thumbnails and preview from UploadThing
      const [existingVideo] = await db
        .select({
          thumbnailKey: videos.thumbnailKey,
          previewKey: videos.previewKey,
        })
        .from(videos)
        .where(eq(videos.muxUploadId, data.upload_id));

      if (!existingVideo) throw new Error("Video not found");

      if (
        existingVideo.thumbnailKey &&
        !existingVideo.thumbnailKey.startsWith("mux-thumbnail-key-")
      ) {
        console.log("Deleting thumbnail from UploadThing");

        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.thumbnailKey);
      }

      if (
        existingVideo.previewKey &&
        !existingVideo.previewKey.startsWith("mux-preview-key-")
      ) {
        console.log("Deleting preview from UploadThing");

        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.previewKey);
      }

      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      console.log("Track ready");

      // Typescript incorrenctly says that asset_id does not exist
      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response("Missing asset ID", { status: 400 });
      }

      await db
        .update(videos)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(videos.muxAssetId, assetId));
      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
};
