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
          <div class="float-right usercontent">
            <h6>Hey! <b>adamxp12</b></h6>
            <a href="#" class="button alert tiny expanded">Logout</a>
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
            <h3>New Shortlink</h3>
            <p>System Name: {sysname}</p>
          </div>

          <div class="page-inner">

            <div class="row">
              <div class="medium-7 columns">
                <div class="callout">
                  <p>Making a new shortlink is a peice of cake</p>
                  <p>Just plop a url into the URL field and you'r done if all you want is a basic shortlink.</p>
                </div>
              </div>

              <div class="medium-5 columns">
                <div class="callout">

                </div>
              </div>
            </div>

            <div class="row">
              <div class="medium-12 columns">
                <ul class="tabs" data-tabs id="example-tabs">
                  <li class="tabs-title is-active"><a href="#basic" aria-selected="true">Basic</a></li>
                  <li class="tabs-title"><a href="#smartlink">SmartLink</a></li>
                  <li class="tabs-title"><a href="#landing">Landing Page</a></li>
                  <li class="tabs-title"><a href="#share">Share</a></li>
                </ul>
                <form method="POST">
                <div class="tabs-content" data-tabs-content="example-tabs">
                  <div class="tabs-panel is-active" id="basic">
                    <div class="row">

                      <div class="medium-6 columns rightborder">
                        <label>Long URL*
                          <input type="URL" name="longurl" required="required" value="{longurl}"></label>

                          <label>Shorturl ID <small> - Bit after shortdomain</small>
                          <input type="text" name="shortlink" placeholder="abc123" value="{shortlink}" class="nomargin"><small>Your shortlink will be http://admb.ga/abc123</small></label><div class="bottommargin"></div>

                      </div>

                      <div class="medium-6 columns">
                        <label>Shortlink Type*
                          <select id="linktype" name="linktype">
                            <option value="generic" {genericchecked}>Generic</option>
                            <option value="amazon" {amazonchecked}>Amazon Affiliate Link</option>
                            <option value="youtube" {youtubechecked}>YouTube Link</option>
                          </select></label>
                          <label id="amazoncode">Amazon Affiliate Code*
                            <input id="amazoncodeinput" class="nomargin" type="text" value="{affid}"><small>Make sure the URL does not already contain any affiliate code as this can mess up the link.</small></label>
                      </div>


                    </div>
                  </div>
                  <div class="tabs-panel" id="smartlink">
                    <input id="smartlinkcheckbox" type="checkbox" {smartlinkchecked}><label for="smartlinkcheckbox">Enable SmartLink</label>
                    <div id="smartlinkcontent">
                      <div class="row">
                      <div class="small-12 medium-6 columns">
                        <label>SmartLink Type*
                          <select id="smartlinktype">
                            <option value="country">Country Redirect</option>
                            <option value="device">Device Redirect</option>
                            <option value="referal">Referal Redirect</option>
                          </select></label>
                      </div>
                      </div>
                      <hr>

                      <div class="row" id="country">
                        <div class="medium-12 columns">
                          <table>
                            <thead>
                              <tr>
                                <th width="150">Country Code</th>
                                <th>URL</th>
                                <th width="100">Remove</th>
                              </tr>
                            </thead>
                            <tr>
                              <td>UK</td>
                              <td>http://youtube.com</td>
                              <td><a href="#" class="button tiny nomargin warning expanded">X</a></td>
                            </tr>
                          </table>
                        </div>
                      </div>

                      <div class="row" id="device">
                        <div class="medium-12 columns">
                          device
                        </div>
                      </div>

                      <div class="row" id="referal">
                        <div class="medium-12 columns">
                          referal
                        </div>
                      </div>

                    </div>
                  </div>
                  <div class="tabs-panel" id="landing">
                    <p>landing</p>
                  </div>
                  <div class="tabs-panel" id="share">
                    <p>share</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <input type="submit" class="button success small" value="Save">
            
          </div>
          </form>


          </div>
          <!-- End Page Content -->
        </div>
      </div>
    </div>