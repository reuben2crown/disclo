import type { ScanRequest } from "@disclo/core";
import { shopifyAdminGraphql } from "./admin-graphql.js";
import { computeContentHash } from "./content-hash.js";
import { productGidToNumericId, toShopifyProductGid } from "./ids.js";
import { stripHtml } from "./strip-html.js";

type ProductQuery = {
  product: {
    id: string;
    title: string;
    descriptionHtml: string | null;
    updatedAt: string;
    featuredImage: { url: string } | null;
    images: { edges: Array<{ node: { url: string } }> };
  } | null;
};

const PRODUCT_QUERY = `#graphql
  query DiscloProduct($id: ID!) {
    product(id: $id) {
      id
      title
      descriptionHtml
      updatedAt
      featuredImage {
        url
      }
      images(first: 20) {
        edges {
          node {
            url
          }
        }
      }
    }
  }
`;

export async function fetchShopifyProductByNumericId(options: {
  shopDomain: string;
  accessToken: string;
  apiVersion: string;
  shopUuid: string;
  numericProductId: string;
}): Promise<ScanRequest | null> {
  const gid = toShopifyProductGid(options.numericProductId);
  const data = await shopifyAdminGraphql<ProductQuery>({
    shopDomain: options.shopDomain,
    accessToken: options.accessToken,
    apiVersion: options.apiVersion,
    query: PRODUCT_QUERY,
    variables: { id: gid },
  });

  const n = data.product;
  if (!n) {
    return null;
  }

  const body = stripHtml(n.descriptionHtml);
  const imageUrls = new Set<string>();
  if (n.featuredImage?.url) {
    imageUrls.add(n.featuredImage.url);
  }
  for (const img of n.images.edges) {
    if (img.node.url) {
      imageUrls.add(img.node.url);
    }
  }
  const sortedUrls = [...imageUrls].sort();
  const numericId = productGidToNumericId(n.id);
  const hashInput = [n.title, body, ...sortedUrls];
  const contentHash = computeContentHash(hashInput);

  return {
    platform: "shopify",
    shop_id: options.shopUuid,
    external_id: numericId,
    content_type: "product",
    fields: {
      title: n.title,
      body: body || undefined,
      image_urls: sortedUrls.length ? sortedUrls : undefined,
      meta: { product_gid: n.id },
    },
    metadata: {
      source_url: `https://${options.shopDomain}/admin/products/${numericId}`,
      updated_at: n.updatedAt,
      content_hash: contentHash,
    },
  };
}
