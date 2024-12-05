/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/https";
 * import {onDocumentWritten} from "firebase-functions/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();

// Cloud function triggered when a new listing is created
export const onNewListing = onDocumentCreated("listings/{listingId}", async (event) => {
  const listing = event.data?.data();
  if (!listing) {
    return {error: "No listing data found"};
  }

  try {
    // Get all device tokens
    const tokensSnapshot = await admin.firestore()
      .collection("deviceTokens")
      .get();

    const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);
    const debugInfo = {
      tokensFound: tokensSnapshot.size,
      tokens: tokens,
      listing: listing,
    };
    logger.info("Debug info:", debugInfo);

    if (tokens.length === 0) {
      return {status: "no_tokens", debug: debugInfo};
    }

    // Send to Expo's Push Service
    const messages = tokens.map((token) => ({
      to: token,
      sound: "default",
      title: "Ny annons hittad!",
      body: `${listing.title} - ${listing.price} kr`,
      data: {listingId: event.params.listingId},
    }));

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();

    return {
      status: "completed",
      response: result,
      debug: debugInfo,
    };
  } catch (error) {
    logger.error("Error:", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      stack: error instanceof Error ? error.stack : undefined,
    };
  }
});
