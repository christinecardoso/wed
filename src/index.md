---
layout: layouts/base.vto
bodyClass: body-home
title: Home
templateEngine: [vto, md]
---

<header class="page-header">
  <h1 class="page-title">{{ home.welcome }}</h1>
</header>

<section class="funnelList">
  {{ for post of search.pages("type=funnel", "order url", 12) }}
  <div class="post card">
    <header class="post-header">
      {{ include "templates/block-details.vto" {
        date: post.date,
        tags: post.tags,
        author: post.author,
        readingInfo: post.readingInfo
        } }}  
    </header>

    <div class="post-excerpt body">
      {{- post.content |> md -}}
    </div>
    <hr>

  </div>
{{ /for }}
</section>
