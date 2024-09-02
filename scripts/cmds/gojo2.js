module.exports = {
	config: {
		name: "gojo2",
		aliases: ["go"],
		version: "1.0",
		author: "Raphael scholar",
		countDown: 5,
		role: 0,
		shortDescription: "send you pic&video of gojo",
		longDescription: "",
		category: "anime",
		guide: "{pn}"
	},

	onStart: async function ({ message }) {
	 var link = [ "https://i.imgur.com/0yA9ZpW.mp4",

"https://i.imgur.com/RKTWov0.jpeg",

"https://i.imgur.com/vBocwop.jpeg",

"https://i.imgur.com/tTZsRfh.jpeg",

"https://i.imgur.com/yT69Sac.jpeg",

"https://i.imgur.com/1qWJ1vy.jpeg",

"https://i.imgur.com/Xc2uBRl.jpeg",

"https://i.imgur.com/kU4R0XK.jpeg",

"https://i.imgur.com/lDDBFYH.mp4",

"https://i.imgur.com/hwFV9Sq.jpeg",

 "https://i.imgur.com/T48CEO6.jpeg",

"https://i.imgur.com/W8GfqZN.jpeg",

"https://i.imgur.com/zkApVTb.jpeg",

"https://i.imgur.com/emUbsFl.jpeg",

"https://i.imgur.com/WYBJMjm.jpeg",

"https://i.imgur.com/QHQGDBj.jpeg",

"https://i.imgur.com/vtCL7i6.jpeg",


"https://i.imgur.com/2RDEUIR.jpeg",

"https://i.imgur.com/AnqajiQ.jpeg",
 
"https://i.imgur.com/NinTb5o.jpeg",

"https://i.imgur.com/QgBL32P.jpeg",

"https://i.imgur.com/NinTb5o.jpeg",

"https://i.imgur.com/QgBL32P.jpeg",

"https://i.imgur.com/gME3HeC.jpeg",

"https://i.imgur.com/OcVyAEg.jpeg"
]

let img = link[Math.floor(Math.random()*link.length)]
message.send({
  body: '「 🌸Satoru Gojo 」',attachment: await global.utils.getStreamFromURL(img)
})
}
             }
