<div class="off-canvas-wrapper">
  <div class="off-canvas-wrapper-inner" data-off-canvas-wrapper>
    <!-- Menu -->
    <div class="off-canvas position-left reveal-for-large adminmenu" id="offCanvas" data-off-canvas>
      <!-- Logo -->
      <div class="logo">
        <h1>EasyLS</h1>
        <h5>Version 1.2 DevAlpha<br>NodeJS Edition</h5>
      </div>

      <hr> <!-- User Section -->
      <div class="float-left usercontent">
        <h6>Hey! <b>{currentuser}</b></h6>
        <a href="/admin/logout" class="button alert tiny expanded">Logout</a>
      </div>

      <hr>
      <!-- Menu -->
      <ul class="menu vertical">
        {menu}
      </ul>
    </div>
    <!-- End Menu -->


    <!-- Page Content -->
    <div class="off-canvas-content maincontent" data-off-canvas-content>
      <div class="page-head with-bg">
        <button type="button" class="button secondary hide-for-large" data-toggle="offCanvas"><i class="fa fa-fw fa-bars"></i></button>
        <h3>Shortlinks</h3>
        <p>System Name: {sysname}</p>
      </div>

      <div class="page-inner">

        <div class="row">
          <div class="medium-7 columns">
            <div class="callout">
              <p>Welcome to your new EasyLS system</p>
              <p>Well done for installing the fancy new and modern NodeJS edition of EasyLS.<br>Packed with more features than the PHP version with improved performance</p>
            </div>
          </div>

          <div class="medium-5 columns">
            <div class="callout">
              <h3>Quick Shorten</h3>

              <div class="input-group">
                <input name="url" class="input-group-field" placeholder="http://google.com" required="" type="url">
                <div class="input-group-button">
                  <input type="submit" class="button success" value="Shorten">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="medium-12 columns">
            <div class="callout">
              <table>
                <thead>
                  <tr>
                    <th>Shortlink</th>
                    <th width="500px">URL</th>
                    <th>Clicks</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {shortlinks}
                </tbody>
              </table>
              <ul class="pagination" role="navigation" aria-label="Pagination">
                <li class="pagination-previous disabled">Previous <span class="show-for-sr">page</span></li>
                <li class="current"><span class="show-for-sr">You're on page</span> 1</li>
                <li><a href="#" aria-label="Page 2">2</a></li>
                <li><a href="#" aria-label="Page 3">3</a></li>
                <li><a href="#" aria-label="Page 4">4</a></li>
                <li class="ellipsis" aria-hidden="true"></li>
                <li><a href="#" aria-label="Page 12">12</a></li>
                <li><a href="#" aria-label="Page 13">13</a></li>
                <li class="pagination-next"><a href="#" aria-label="Next page">Next <span class="show-for-sr">page</span></a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="reveal" id="copiedmessage" data-reveal data-close-on-click="true" data-animation-in="hinge-in-from-bottom" data-animation-out="hinge-out-from-top">
          <h1>Copied!</h1>
          <p class='lead'>Now go paste that bad boy into a tweet or something else equally cool.</p>
          <button class="close-button" data-close aria-label="Close reveal" type="button">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <!-- Because safari sux we need to display a message just for them so that they can copy it manually -->
        <div class="reveal" id="safaricopiedmessage" data-reveal data-close-on-click="true" data-animation-in="hinge-in-from-bottom" data-animation-out="hinge-out-from-top">
          <h1>Safari User?</h1>
          <p class='lead'>You will need to manually copy the link from the textbox below</p>
          <input type="text" value="" readonly id="safariusercopybox" />
          <button class="close-button" data-close aria-label="Close reveal" type="button">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

      </div>
      <!-- End Page Content -->
    </div>
  </div>
  <script src="/js/clipboard.min.js"></script>
  <script> 
  var clipboard = new Clipboard('.copy');
  clipboard.on('success', function(e) {
    $('#copiedmessage').foundation('open');
    e.clearSelection();
  });

  clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
    $('#safariusercopybox').val($(e.trigger).data("clipboard-text"));
    $('#safaricopiedmessage').foundation('open');
  });
  </script>
