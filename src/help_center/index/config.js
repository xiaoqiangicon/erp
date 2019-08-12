import "juicer";
var appConfig = {
  environment: 0
};
appConfig.template = appConfig.template || ({});
appConfig.template.component = {};
appConfig.template.component.menu_list = ["<li class=\"my-logo custom-link\">", "<a href=\"/\" target=\"_blank\" class=\"custom-link\"></a>", "</li>", "{@each data as item, index}", "<li class=\"chapter\">", "<a href=\"javascript:void[0]\" data-id=\"${item.id}\" class=\"firstMenu\">", "${item.name}", "</a>", "{@if item.contentList && item.contentList.length>0}", "<ul class=\"articles\">", "{@each item.contentList as subitem, subindex}", "<li class=\"chapter sub_chapter\">", "<a href=\"/zzhadmin/helpIndex/?contentId=${subitem.id}\" data-id=\"${subitem.id}\">", "${subitem.title}", "</a>", "</li>", "{@/each}", "</ul>", "{@/if}", "</li>", "{@/each}"].join(" ");
appConfig.template.component.help_content = ["<h1 id=\"${id}\">${title}</h1>", "<div class=\"addTimeDiv\"><span class=\"addTime\">${addTime}</span></div>", "$${content}", "{@if preContent != \"\"}", "<div id=\"prevArticle\">上一条: <a href=\"/zzhadmin/helpIndex/?contentId=${preContent.id}\" data-id=\"${preContent.id}\">${preContent.title}</a></div>", "{@/if}", "{@if nextContent != \"\"}", "<div id=\"nextArticle\">下一条: <a href=\"/zzhadmin/helpIndex/?contentId=${nextContent.id}\" data-id=\"${nextContent.id}\">${nextContent.title}</a></div>", "{@/if}"].join(" ");
export default appConfig;
