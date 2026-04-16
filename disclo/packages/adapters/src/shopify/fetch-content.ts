import type { ScanRequest } from "@disclo/core";
import { shopifyAdminGraphql } from "./admin-graphql.js";
import { computeContentHash } from "./content-hash.js";
import { productGidToNumericId } from "./ids.js";
import { stripHtml } from "./strip-html.js";

type ProductsQuery = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{
      node: {
        id: string;
        title: string;
        descriptionHtml: string | null;
        updatedAt: string;
        featuredImage: { url: string } | null;
        images: { edges: Array<{ node: { url: string } }> };
      };
    }>;
  };
};

const PRODUCTS_QUERY = `#graphql
  query DiscloProducts($cursor: String) {
    products(first: 50, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
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
    }
  }
`;

export async function fetchShopifyProductPage(options: {
  shopDomain: string;
  accessToken: string;
  apiVersion: string;
  shopUuid: string;
  cursor?: string;
}): Promise<{ requests: ScanRequest[]; nextCursor: string | null }> {
  const data = await shopifyAdminGraphql<ProductsQuery>({
    shopDomain: options.shopDomain,
    accessToken: options.accessToken,
    apiVersion: options.apiVersion,
    query: PRODUCTS_QUERY,
    variables: { cursor: options.cursor ?? null },
  });

  const requests: ScanRequest[] = [];
  for (const edge of data.products.edges) {
    const n = edge.node;
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

    requests.push({
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
    });
  }

  const next = data.products.pageInfo.hasNextPage
    ? data.products.pageInfo.endCursor
    : null;

  return { requests, nextCursor: next };
}
