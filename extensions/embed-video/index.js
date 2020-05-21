'use strict';

function youtubeHook($item) {
	  const id = $item.text();
	  const width = Number($item.attr('width')) || 640;
	  const height = Number($item.attr('height')) || 480;
	  return `<iframe class="embed-video embed-video-youtube" src="//www.youtube-nocookie.com/embed/${id}" width="${width}" height="${height}" allowfullscreen> </iframe>`;
}

function kakaotvHook($item) {
	  const id = $item.text();
	  const width = Number($item.attr('width')) || 640;
	  const height = Number($item.attr('height')) || 480;
	  return `<iframe class="embed-video embed-video-kakaotv" width="${width}" height="${height}" src="//tv.kakao.com/embed/player/cliplink/${id}" allowfullscreen frameborder="0" scrolling="no"> </iframe>`;
}

function nicoHook($item) {
	  const id = $item.text();
	  const width = Number($item.attr('width')) || 640;
	  const height = Number($item.attr('height')) || 480;
	  return `<iframe class="embed-video embed-video-nico" width="${width}" height="${height}" src="//embed.nicovideo.jp/watch/${id}" allowfullscreen frameborder="0" scrolling="no"> </iframe>`;
}

function navertvHook($item) {
	  const id = $item.text();
	  const width = Number($item.attr('width')) || 640;
	  const height = Number($item.attr('height')) || 480;
	  return `<iframe class="embed-video embed-video-navertv" width="${width}" height="${height}" src="//tv.naver.com/embed/${id}?autoPlay=false&oNm=outKeyPlayer.nhn" allowfullscreen frameborder="0" scrolling="no" allow="encrypted-media"> </iframe>`;
}

function vimeoHook($item) {
	  const id = $item.text();
	  const width = Number($item.attr('width')) || 640;
	  const height = Number($item.attr('height')) || 480;
	  return `<iframe class="embed-video embed-video-vimeo" width="${width}" height="${height}" src="//player.vimeo.com/video/${id}" allowfullscreen frameborder="0" scrolling="no"> </iframe>`;
}

function soundcloudHook($item) {
	  const id = $item.text();
	  const width = Number($item.attr('width')) || 640;
	  const height = Number($item.attr('height')) || 480;
	  return `<iframe class="embed-video embed-video-soundcloud" width="${width}" height="${height}" src="//w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F${id}&show_artwork=true" allowfullscreen frameborder="0" scrolling="no" allow="encrypted-media"> </iframe>`;
}

module.exports.import = (helper) => {
	  helper.parserHook.setXmlHook({
		      type: 'afterSanitize',
		      selector: 'youtube',
		      hook: youtubeHook,
		      allowedTags: ['youtube'],
		      allowedAttributes: {
			            youtube: ['width', 'height'],
			          },
		    });
	  helper.parserHook.setXmlHook({
		      type: 'afterSanitize',
		      selector: 'kakaotv',
		      hook: kakaotvHook,
		      allowedTags: ['kakaotv'],
		      allowedAttributes: {
			            kakaotv: ['width', 'height'],
			          },
		    });
	helper.parserHook.setXmlHook({
		    type: 'afterSanitize',
		    selector: 'nico',
		    hook: nicoHook,
		    allowedTags: ['nico'],
		    allowedAttributes: {
			          nico: ['width', 'height'],
			        },
		  });

	helper.parserHook.setXmlHook({
		    type: 'afterSanitize',
		    selector: 'navertv',
		    hook: navertvHook,
		    allowedTags: ['navertv'],
		    allowedAttributes: {
			          nico: ['width', 'height'],
			        },
		  });
		
		helper.parserHook.setXmlHook({
		    type: 'afterSanitize',
		    selector: 'vimeo',
		    hook: vimeoHook,
		    allowedTags: ['vimeo'],
		    allowedAttributes: {
			          nico: ['width', 'height'],
			        },
		  });
		
		helper.parserHook.setXmlHook({
		    type: 'afterSanitize',
		    selector: 'soundcloud',
		    hook: soundcloudHook,
		    allowedTags: ['soundcloud'],
		    allowedAttributes: {
			          nico: ['width', 'height'],
			        },
		  });
};

