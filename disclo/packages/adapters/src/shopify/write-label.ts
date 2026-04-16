import { AdapterError } from "@disclo/core";
import type { LabelInstruction } from "@disclo/core";
import { shopifyAdminGraphql } from "./admin-graphql.js";
import { toShopifyProductGid } from "./ids.js";
import { parseShopifyMetaKey } from "./parse-meta-key.js";

type MetafieldsSet = {
  metafieldsSet: {
    metafields: Array<{ id: string }> | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
};

const METAFIELDS_SET = `#graphql
  mutation DiscloMetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function writeProductMetafieldLabel(options: {
  shopDomain: string;
  accessToken: string;
  apiVersion: string;
  instruction: LabelInstruction;
}): Promise<void> {
  const { namespace, key } = parseShopifyMetaKey(options.instruction.meta_key);
  const ownerId = toShopifyProductGid(options.instruction.external_id);

  const value =
    options.instruction.action === "remove_label"
      ? ""
      : options.instruction.label_text || options.instruction.meta_value;

  const data = await shopifyAdminGraphql<MetafieldsSet>({
    shopDomain: options.shopDomain,
    accessToken: options.accessToken,
    apiVersion: options.apiVersion,
    query: METAFIELDS_SET,
    variables: {
      metafields: [
        {
          ownerId,
          namespace,
          key,
          type: "multi_line_text_field",
          value,
        },
      ],
    },
  });

  const errs = data.metafieldsSet.userErrors;
  if (errs.length) {
    throw new AdapterError(
      `metafieldsSet failed: ${errs.map((e) => e.message).join("; ")}`,
    );
  }
}
