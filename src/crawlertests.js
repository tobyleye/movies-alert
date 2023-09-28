import {
  generateDownloadLinkFromMovieLink,
  generateDownloadLinksFromRedirectLink,
} from "./crawler.js";

let greenLandMovieRedirectLink = `https://tfpdl.se/tfpdl?d048c7b91a=ZW52bmdreWFZaVRSWE1ObGFzNnZPdUJUcCsrbHdEUkhOU004TFRQNHFLU0J3NjZCMDY4YW1IZnJSQ00zemU5N29BbWFZTTVkemxxcnd1T2JFVzl4SmswU2lzSFd5cWtHelRVYXBQVmFpVFE9`;
let barbieRedirectLink = `https://tfpdl.se/tfpdl?d048c7b91a=K2h3VWplSEdFckk3MWF0RGNiaHV6bFl1bExPMVJjYVJtbVpOZjdoeG5RL3MvUGJvc00wQXhUWkVDZWFIaXF5d1RFK3ZhT3JONkVKTjA3VlVINEIvaEE9PQ==`;

generateDownloadLinksFromRedirectLink(barbieRedirectLink);

// let greenlandMovie = "https://tfpdl.se/greenland-2020-720p-bluray-x264-tfpdl/";
// generateDownloadLinkFromMovieLink(greenlandMovie).then((links) => {
//   console.log("::links::");
//   console.log(links);
// });
