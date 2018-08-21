/* global $ */

// dom节点封装
let Dom = {
  window: $(window),
  document: $(document),
  htmlbody: $('html, body'),
  container: $('.container'),
  fictionContent: $('.fiction_content'),
  fictionPages: $('.fiction_pages ul li')
}
// 初始化章节
let chapterId = 1
// 所有章节
let totalChapterId = 4

// 上一页
Dom.fictionPages.eq(0).click(function () {
  if (Number.parseInt(chapterId) === 1) {
    window.alert('这个第一个章节')
    return
  }
  chapterId--
  // 获取数据
  // 未封装ajax方法
  FetchFictionDataHandler(chapterId, function (data) {
    chapterContentRender(data)
  })
  // 获取数据
  // 封装ajax方法
  // step2(chapterId, function (url) {
  //   step3(url)
  // })
  Dom.htmlbody.animate({ scrollTop: 0 }, 'fast')
})
// 下一页
Dom.fictionPages.eq(1).click(function () {
  if (Number.parseInt(chapterId) === totalChapterId) {
    window.alert('这个最后一个章节')
    return
  }
  chapterId++
  // 获取数据
  // 未封装ajax方法
  FetchFictionDataHandler(chapterId, function (data) {
    chapterContentRender(data)
  })
  // 获取数据
  // 封装ajax方法
  // step2(chapterId, function (url) {
  //   step3(url)
  // })
  Dom.htmlbody.animate({ scrollTop: 0 }, 'fast')
})
// 文章内容渲染
function chapterContentRender (data) {
  let realdata = JSON.parse(data)
  // 拼接html
  let html = `<h4>${realdata.t}</h4>`
  realdata.p.forEach(element => {
    html += `<p>${element}</p>`
  })
  Dom.fictionContent.html('')
  Dom.fictionContent.html(html)
}

// 获取数据
// 未封装ajax方法
FetchFictionDataHandler(chapterId, function (data) {
  chapterContentRender(data)
})
// 获取数据
// 封装ajax方法
// step1(function (chapterId) {
//   step2(chapterId, function (url) {
//     step3(url)
//   })
// })

// 文章内容数据请求
function FetchFictionDataHandler (chapterId, callback) {
  if (!chapterId) {
    // 获取文章章节数据
    $.get('../data/chapter.json', function (result) {
      if (result.result === 0) {
        let chapters = result.chapters
        chapterId = chapters[0].chapter_id + 1
        // 获取文章内容链接数据
        $.get(`../data/data${chapterId}.json`, function (result) {
          if (result.result === 0) {
            let url = result.jsonp
            // 获取文章内容详情数据
            $.jsonp({
              url: url,
              cache: true,
              callback: 'duokan_fiction_chapter',
              success: function (result) {
                if (result) {
                  let data = $.base64.decode(result)
                  let json = decodeURIComponent(escape(data))
                  callback && callback(json)
                }
              }
            })
          }
        })
      }
    })
  } else {
    // 获取文章内容链接数据
    $.get(`../data/data${chapterId}.json`, function (result) {
      if (result.result === 0) {
        let url = result.jsonp
        // 获取文章内容详情数据
        $.jsonp({
          url: url,
          cache: true,
          callback: 'duokan_fiction_chapter',
          success: function (result) {
            if (result) {
              let data = $.base64.decode(result)
              let json = decodeURIComponent(escape(data))
              callback && callback(json)
            }
          }
        })
      }
    })
  }
}

function step1 (callback) {
  $.get('../data/chapter.json', function (result) {
    if (result.result === 0) {
      let chapters = result.chapters
      chapterId = chapters[0].chapter_id + 1
      callback && callback(chapterId)
    }
  })
}

function step2 (chapterId, callback) {
  $.get(`../data/data${chapterId}.json`, function (result) {
    if (result.result === 0) {
      let url = result.jsonp
      callback && callback(url)
    }
  })
}

function step3 (url) {
  $.jsonp({
    url: url,
    cache: true,
    callback: 'duokan_fiction_chapter',
    success: function (result) {
      if (result) {
        let data = $.base64.decode(result)
        let json = decodeURIComponent(escape(data))
        chapterContentRender(json)
      }
    }
  })
}
