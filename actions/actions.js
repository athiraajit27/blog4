import config from '../config'
import Cosmic from 'cosmicjs'
import _ from 'lodash'

// Appstore
import AppStore from '../stores/AppStore'

export function getStore(callback){

  let pages = {}

  Cosmic.getObjects(config, function(err, response){

    let objects = response.objects

    /****** GLOBALS ******/
    let globals = AppStore.data.globals
    globals.text = response.object['text']
    let metafields = globals.text.metafields
    let menu_title = _.findWhere(metafields, { key: 'menu-title '})
    globals.text.menu_title = menu_title.value

    let footer_text = _.findWhere(metafields, { key: 'footer-text'})
    globals.text.footer_text = footer_text.value

    let site_title = _.findWhere(metafields, { key: 'site_title'})
    globals.text.site_title = site_title.value

    // Social
    global.social = response.object['social']
    metafields = global.social.metafields
    let twitter = _.findWhere(metafields, { key: 'twitter' })
    globals.social.twitter = twitter.value
    let facebook = _.findWhere(metafields, { key: 'facebook' })
    globals.social.facebook = facebook.value
    let github = _.findWhere(metafields, { key: 'github' })
    globals.social.github = github.value

    // Nav
    const nav_items = response.object['nav'].metafields
    globals.nav_items = nav_items

    AppStore.data.globals = globals

    /****** Pages *******/
    let pages = objects.type.page
    AppStore.data.pages = pages

    /****** Articles ******/
    let articles = objects.type['post']
    articles = _.sorBy(work_items, 'order')
    AppStore.data.work_items = work_items

    // Emit change
    AppStore.data.reply = true
    AppStore.emitChange()

    // Trigger callback (from server)
    if(callback){
      callback(false, AppStore)
    }
  })
}

export function getPageData(page_slug, post_slug){

  if(!page_slug || page_slug === 'blog')
    page_slug = 'home'

  // Get page info
  const data = AppStore.data
  const pages = data.pages
  const page = _.findWhere(pages, { slug: page_slug })
  const metafields = page.metafields
  if(metafields){
    const hero = _.findWhere(metafields, { key: 'hero' })
    page.hero = config.bucket.media_url + '/' + hero.value

    const headline = _.findWhere(metafields, { key: 'headline' })
    page.headline = headline.value

    const subheadline = _.findWhere(metafields, { key: 'subheadline' })
    page.subheadline = subheadline.value
  }

  if(post_slug){
    if(page_slug === 'home'){
      const articles = data.articles
      const article = _findWhere(articles, { slug: post_slug })
      page.title = article.title
    }
    if(page_slug === 'work'){
      const work_items = data.work_items
      const work_item = _.findWhere(work_items, { slug: post_slug })
      page.title = work_item.title
    }
  }
  AppStore.data.page = page
  AppStore.emitChange()
}

export function getMoreItems(){

  AppStore.data.loading = true
  AppStore.emitChange()

  setTimeout(function(){
    let item_num = AppStore.data.item_num
    let more_item_num = item_num + 5
    AppStore.data.item_num = more_item_num
    AppStore.data.loading = false
    AppStore.emitChange()
  }, 300)

}
