export type SimpleHashNFTResponse = {
    nft_id: string;
    chain: string;
    contract_address: string;
    token_id: string;
    name: string;
    description: string;
    previews: {
      image_small_url: string;
      image_medium_url: string;
      image_large_url: string;
      image_opengraph_url: string;
      blurhash: string;
      predominant_color: string;
    };
    image_url: string;
    image_properties: {
      width: number;
      height: number;
      size: number;
      mime_type: string;
    };
    video_url: string;
    video_properties: string;
    audio_url: string;
    audio_properties: string;
    model_url: string;
    model_properties: string;
    other_url: string;
    other_properties: string;
    background_color: string;
    external_url: string;
    created_date: string;
    status: string;
    token_count: number;
    owner_count: number;
    owners: {
      owner_address: string;
      quantity: number;
      quantity_string: number;
      first_acquired_date: string;
      last_acquired_date: string;
    }[];
    contract: {
      type: string;
      name: string;
      symbol: string;
      deployed_by: string;
      deployed_via_contract: string;
    };
    collection: {
      collection_id: string;
      name: string;
      description: string;
      image_url: string;
      banner_image_url: string;
      category: string;
      is_nsfw: boolean;
      external_url: string;
      twitter_username: string;
      discord_url: string;
      instagram_username: string;
      medium_username: string;
      telegram_url: string;
      marketplace_pages: {
        marketplace_id: string;
        marketplace_name: string;
        marketplace_collection_id: string;
        nft_url: string;
        collection_url: string;
        verified: boolean;
      }[];
      metaplex_mint: string;
      metaplex_first_verified_creator: string;
      floor_prices: {
        marketplace_id: string;
        marketplace_name: string;
        value: number;
        payment_token: {
          payment_token_id: string;
          name: string;
          symbol: string;
          address: string;
          decimals: number;
        };
      }[];
      top_bids: any[];
      distinct_owner_count: number;
      distinct_nft_count: number;
      total_quantity: number;
      chains: string[];
      top_contracts: string[];
    };
    last_sale: string;
    first_created: {
      minted_to: string;
      quantity: number;
      quantity_string: string;
      timestamp: string;
      block_number: number;
      transaction: string;
      transaction_initiator: string;
    };
    rarity: {
      rank: number;
      score: number;
      unique_attributes: number;
    };
    royalty: {
      source: string;
      total_creator_fee_basis_points: number;
      recipients: {
        address: string;
        percentage: number;
        basis_points: number;
      }[];
    }[];
    extra_metadata: {
      attributes: {
        trait_type: string;
        value: string;
        display_type: string;
      }[];
      platform: string;
      tokenID: string;
      series: string;
      aspect_ratio: number;
      payout_address: string;
      minted: boolean;
      artist: string;
      script_type: string;
      project_id: string;
      curation_status: string;
      heritage_curation_status: string;
      generator_url: string;
      royaltyInfo: {
        artistAddress: string;
        additionalPayee: string;
        additionalPayeePercentage: string;
        royaltyFeeByID: number;
      };
      collection_name: string;
      token_hash: string;
      features: {
        Style: string;
        Palette: string;
        Movement: string;
      };
      traits: {
        trait_type: string;
        value: string;
      }[];
      is_static: boolean;
      license: string;
      image_original_url: string;
      animation_original_url: string;
      metadata_original_url: string;
    };
  };