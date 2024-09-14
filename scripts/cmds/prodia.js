const axios = require("axios");

module.exports = {
  config: {
    name: "prodia",
    version: "1.1",
    author: "Raphael scholar",
    role: 0,
    shortDescription: {
      en: 'Text to Image'
    },
    category: "image",
    guide: {
      en: `{pn} your prompt | type models here are \n
1 | 3Guofeng3_v34
2 | absolutereality_V16
3 | absolutereality_v181
4 | analog-diffusion-1.0.ckpt
5 | anythingv3_0-pruned.ckpt
6 | anything-v4.5-pruned.ckpt
7 | anythingV5_PrtRE
8 | AOM3A3_orangemixs
9 | blazing_drive_v10g
10 | cetusMix_Version35
11 | childrensStories_v13D
12 | childrensStories_v1SemiReal
13 | childrensStories_v1ToonAnime
14 | Counterfeit_v30
15 | cuteyukimixAdorable_midchapter3
16 | cyberrealistic_v33
17 | dalcefo_v4
18 | deliberate_v2
19 | deliberate_v3
20 | dreamlike-anime-1.0
21 | dreamlike-diffusion-1.0
22 | dreamlike-photoreal-2.0
23 | dreamshaper_6BakedVae
24 | dreamshaper_7
25 | dreamshaper_8
26 | edgeOfRealism_eorV20
27 | EimisAnimeDiffusion_V1
28 | elldreths-vivid-mix
29 | epicrealism_naturalSinRC1VAE
30 | ICantBelieveItsNotPhotography_seco
31 | juggernaut_aftermath
32 | lofi_v4
33 | lyriel_v16
34 | majicmixRealistic_v4
35 | mechamix_v10
36 | meinamix_meinaV9
37 | meinamix_meinaV11
38 | neverendingDream_v122
39 | openjourney_V4
40 | pastelMixStylizedAnime_pruned_fp16
41 | portraitplus_V1.0
42 | protogenx34
43 | Realistic_Vision_V1.4-pruned-fp16
44 | Realistic_Vision_V2.0
45 | Realistic_Vision_V4.0
46 | Realistic_Vision_V5.0
47 | redshift_diffusion-V10
48 | revAnimated_v122
49 | rundiffusionFX25D_v10
50 | rundiffusionFX_v10
51 | sdv1_4.ckpt
52 | v1-5-pruned-emaonly
53 | shoninsBeautiful_v10
54 | theallys-mix-ii-churned
55 | timeless-1.0.ckpt`
    }
  },
  onStart: async function ({ message, api, args, event }) {
    const text = args.join(' ');

    if (!text) {
      return message.reply("Please provide a prompt with models");
    }

    const [prompt, model] = text.split('|').map((text) => text.trim());
    const models = model || "2";
    const puti = 'xyz'
      let baseURL = `https://smfahim.${puti}/prodia?prompt=${prompt}&model=${models}`;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const attachment = await global.utils.getStreamFromURL(baseURL);

    message.reply({
      attachment
    });

    api.setMessageReaction("✅", event.messageID, () => {}, true);
  }
};
