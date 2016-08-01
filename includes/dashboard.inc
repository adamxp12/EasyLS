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
          <img src="https://avatars.io/twitter/{currentuser}/large" class="profile circle">
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
            <h3>Dashboard</h3>
            <p>System Name: Adam Blunt (admb.ga)</p>
          </div>

          <div class="page-inner">
            <div class="row">

              <div class="small-6 medium-3 columns">
                <div class="callout"><h5>Short Links</h5><h4>{linkcount}</h4></div>
              </div>

              <div class="small-6 medium-3 columns">
                <div class="callout"><h5>Total Clicks</h5><h4>{totalclicks}</h4></div>
              </div>

              <div class="small-6 medium-3 columns">
                <div class="callout"><h5>Twitter Clicks</h5><h4>{twitterclicks}</h4></div>
              </div>

              <div class="small-6 medium-3 columns">
                <div class="callout"><h5>Facebook Clicks</h5><h4>{facebookclicks}</h4></div>
              </div>

            </div>

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
              <div class="medium-3 columns">
                <div class="callout">f</div>
              </div>
              <div class="medium-9 columns">
                <div class="callout">
                  <table>
                    <thead>
                      <tr>
                        <th>Shortlink</th>
                        <th width="500px">URL</th>
                        <th>Clicks</th>
                        <th>Twitter Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortlinks}
                    </tbody>
                  </table>
                  <a class="button tiny success float-right">View More</a><div class="clearfix"></div>
                </div>
              </div>
            </div>


          </div>
          <!-- End Page Content -->
        </div>
      </div>