export default `
<a class="component-nav-logo-container" href="/zzhadmin/"><span class="component-nav-logo pull-left"></span></a>
<div class="component-nav-top-nav">
    <ul class="component-nav-top-nav-right pull-right">
        <li class="dropdown">
            <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                <span class="component-nav-username" data-temple-name="1"></span>
                <b class="caret component-nav-caret"></b>
            </a>
            <ul class="dropdown-menu component-nav-logout">
                <li><a href="/zzhadmin/logout/">注销</a></li>
            </ul>
        </li>
    </ul>
</div>
<a href="/zzhadmin/helpIndex/" target="_blank" class="component-nav-help-center">
    <span class="component-nav-help-center-text">帮助中心</span>
    <i class="component-nav-help-center-icon"></i>
</a>
<div class="notice-btn-box" id="notice-btn-box">
    <div class="n-text">通知中心</div>
    <div class="n-num" id="notice-unread-num">
        <span></span>未读
    </div>
</div>
`;
