import { UrlMatch } from "@jsdevtools/rehype-url-inspector"

// XXX: exceptions are hard-coded for now, to avoid having to make actual
// DNS resolutions & GeoIP lookups during build time
function isHostLikelyCNDomestic(hostname: string): boolean {
  if (hostname.endsWith('.cn')) {
    if (hostname.endsWith('slackwarecn.cn'))
      return false

    return true
  }

  if (hostname.endsWith('gitee.com') || hostname.endsWith('katyusha.net')
    || hostname.endsWith('sseinfo.com'))
    return true

  return false
}

export default function doAnnotateOverseasLinks({ url, node }: UrlMatch) {
  if (!url.startsWith('http')) {
    // non-absolute or non-HTTP(S) link
    return
  }

  const hostname = new URL(url).hostname
  if (isHostLikelyCNDomestic(hostname))
    return

  // console.log('annotating', url)
  if (node.properties.hasOwnProperty('class'))
    node.properties.class += ' link--overseas'
  else
    node.properties.class = 'link--overseas'
}
