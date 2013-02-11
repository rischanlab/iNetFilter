
function abpwa(config){this.hostname=config.hostname;this.thserver=config.thserver;this.paths=config.paths;this.props=config.props;this.alternative_content=false;this.all_spots_on_page=new Array();this.loaded_spots=new Array();this.alternative_spots=new Array();}
abpwa.prototype.start=function(callBack){for(var i=0;i<this.all_spots_on_page.length;i++){if($.inArray(this.all_spots_on_page[i],this.loaded_spots)==-1){this.replaceSpot(this.all_spots_on_page[i]);}else{this.checkIframeTree(this.all_spots_on_page[i],$('#as_'+this.all_spots_on_page[i]),1);}}
if(typeof callBack=="function")
callBack();};abpwa.prototype.checkIframeTree=function(spot_id,frame,counter){try{if(frame){var visible=this.isFrameVisible(spot_id,frame);var children=$(frame).contents().find('*').length;var next_frame=$(frame).contents().find('iframe');if(children==0||frame.attr('src').search(window.location.hostname)==-1){return;}
if(!visible||children<=4){this.replaceSpot(spot_id);return;}
if(next_frame.length==0)
return;this.checkIframeTree(spot_id,next_frame,++counter);}}catch(e){}};abpwa.prototype.isFrameVisible=function(spot_id,frame){var spot=$('#as_'+spot_id);var visibility=spot.css('visibility');var display=spot.css('display');return!(visibility=='hidden'||display=='none');};abpwa.prototype.replaceSpot=function(spot_id){var alternative=this.getAlternativeContentForSpot(spot_id);if(alternative&&parseInt(alternative.complex)==0){this.alternative_spots.push(alternative.banner_id);if(alternative.picurl.toString().search('/swf/')!==-1){this.flashRenderer(alternative);}else{this.imageRenderer(alternative);}}};abpwa.prototype.getAlternativeContentForSpot=function(spot_id){return this.alternative_content[spot_id]!=undefined?this.alternative_content[spot_id]:false;};abpwa.prototype.imageRenderer=function(image){var spot=this.getSpotIdDOM(image.spot);var ps=this.getCssProperties(spot);var div=document.createElement('span');var a=document.createElement('a');a.target="_blank";a.href=this.getClickUrl(image.banner_id);var im=document.createElement('img');im.border=0;im.src=this.getResourceUrl(image.picurl);a.appendChild(im);div.appendChild(a);spot.replaceWith(div);if(image.spot!=3){this.setCssProperties(div,ps);}};abpwa.prototype.flashRenderer=function(flash){var a=document.createElement('a');a.target="_blank";a.href=this.getClickUrl(flash.banner_id);var ob=document.createElement('object');ob.classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';ob.codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0';ob.id='player';ob.align='middle';ob.value=this.getClickUrl(flash.banner_id);var em=document.createElement('embed');var pa=document.createElement('param');em.src=this.getClickUrl(flash.banner_id);em.quality='high';em.name='player';em.align='middle';em.width=flash.width;em.height=flash.height;em.type='application/x-shockwave-flash';em.pluginspage='http://www.macromedia.com/go/getflashplayer';pa.name='movie';pa.value=this.getClickUrl(flash.banner_id);ob.appendChild(pa);ob.appendChild(em);a.appendChild(ob);$('#as_'+flash.spot).replaceWith(a);};abpwa.prototype.getClickUrl=function(resource_id){return'http://'+this.hostname+'/click.php?id='+resource_id+'&videoid=0';};abpwa.prototype.getResourceUrl=function(resource_path){var random_path=this.paths[Math.floor(Math.random()*(this.paths.length-1))];return this.thserver+'/'+random_path+'/'+resource_path;};abpwa.prototype.setCssProperties=function(element,properties){var allprops=new Array();for(var i=0;i<properties.length;i++){var current_property_value=properties[i].value;var current_property_name=properties[i].name;if($(element).css(current_property_name)!=current_property_value){$(element).css(current_property_name,current_property_value);}}};abpwa.prototype.getCssProperties=function(element){var allprops=new Array();for(var i=0;i<this.props.length;i++){var current_property_value=$(element).css(this.props[i]);var current_property_name=this.props[i];allprops.push({'name':current_property_name,'value':current_property_value});}
return allprops;};abpwa.prototype.addSpotLoaded=function(space_id){this.loaded_spots.push(space_id);};abpwa.prototype.setAllAlternative=function(alternative_content){this.alternative_content=alternative_content;};abpwa.prototype.setAllSpots=function(spaces){this.all_spots_on_page=spaces;};abpwa.prototype.getSpotIdDOM=function(spot_id){var element=false;switch(parseInt(spot_id)){case 2:element=$('.ntva');break;case 9:element=$('#as_9').parent();break;default:element=$('#as_'+spot_id);}
return element;};var allowWebmasterEmail=true;function webmasterEmail(){if(allowWebmasterEmail){allowWebmasterEmail=false;var email=$('#webmaster_email').val();if(email.length<7||email==lang.get('YourEmail')){allowWebmasterEmail=true;$('#webmaster_email').val(lang.get('YourEmail'));$('#webmaster_email').css({color:'#929292'});return false;}
$('#invalidWebmasterEmail').hide();$.ajax({url:"/webmaster",type:"POST",context:"document.body",dataType:"json",data:{"email":email},error:function(request,error){allowWebmasterEmail=true;},success:function(data){allowWebmasterEmail=true;if(data.success!=undefined&&data.success==true){allowWebmasterEmail=false;$('#webmasterEmailForm').hide();$('#webmasterEmailSaved').show();}else{alert(data.response);}}});}
return true;}
var allowSubmitRegistrationForm=true;var aRegistrationFormSave='';function submitRegistrationForm(){if(!allowSubmitRegistrationForm)return;allowSubmitRegistrationForm=false;if($('#form_user').is(':visible')){var formData=$('#form_user').serializeArray();var oRegistrationFormData={type:'user'};}else{var formData=$('#form_webmaster').serializeArray();var oRegistrationFormData={type:'webmaster'};}
$.each(formData,function(i,element){oRegistrationFormData[element.name]=element.value;});$.ajax({url:"/register",type:"POST",context:"document.body",dataType:"json",data:oRegistrationFormData,error:function(request,error){},success:function(data){if(data.success!=undefined&&data.success==true){if(data.redirectURL!==undefined){window.location.replace(data.redirectURL);}}else{if(data.aErrors!==undefined&&data.aErrors[0]!==undefined){displayRegistrationError(data.aErrors[0][0],data.aErrors[0][1]);}}},complete:function(){allowSubmitRegistrationForm=true;}});return true;}
function displayRegistrationError(sFieldID,sErrorText){$('#createAccountPanel .errorField').removeClass('errorField');$('#createAccountPanel .errorBox').hide();$('#createAccountPanel .input_'+sFieldID).addClass('errorField');$('#createAccountPanel .errorBox .errorBoxBody p').text(sErrorText);$('#createAccountPanel .errorBox').show();}
var sSlidePanelIndexJoinCommunity='joinCommunity';function openJoinCommunityWindow(){openSlidePanel({id:sSlidePanelIndexJoinCommunity,url:'/panel/join_community',onload:function(){},onshow:function(){}});}
function hideJoinCommunityPanel(){bAllowJoinCommunity=true;closeSlidePanel(sSlidePanelIndexJoinCommunity);}
var bShowJoinCommunityAfterClose=false;var sSlidePanelIndexCreateAccount='createAccount';function openCreateAccountWindow(){if(sCurrentPage=='community'){loginHide(false,true);hideJoinCommunityPanel();openSlidePanel({id:sSlidePanelIndexCreateAccount,url:'/panel/create_account',onload:function(){},onshow:function(){}});}else{setCookie('openCreateAccountWindow','1',1);window.top.location='/community';}}
function hideCreateAccountPanel(bFromLogin){bAllowCreateAccount=true;closeSlidePanel(sSlidePanelIndexCreateAccount);if(bFromLogin==undefined&&bShowJoinCommunityAfterClose&&!bOpenedLogin)
openJoinCommunityWindow();}
var bOpenedLogin=false;var iLoginFrameHeight=132;var sSlidePanelIndexLogin='login';function loginResize(iHeight){iLoginFrameHeight=iHeight;if(getSlidePanel(sSlidePanelIndexLogin).is(':visible')){resizeSlidePanel(sSlidePanelIndexLogin,iHeight);}}
function hideLoginPanel(){try{loginHide(false,true);if(bShowJoinCommunityAfterClose)
openJoinCommunityWindow();}catch(e){location.reload();}}
function showLogin(cbOnLogin){hideCreateAccountPanel(true);hideJoinCommunityPanel();window.loginCallback=cbOnLogin;openIFrameSlidePanel({id:sSlidePanelIndexLogin,url:'/htmllogin',height:iLoginFrameHeight,onshow:function(){if(oGlobalSettings.isAndroidDevice())
return;var $frame=getSlidePanel(sSlidePanelIndexLogin).find('iframe');var $input=$frame.contents().find('input:first');resizeSlidePanel(sSlidePanelIndexLogin,$frame.contents().find('#loginBox').outerHeight());try{$frame.focus();$input.focus();$input.select();}catch(err){}}});}
function isLogged(){return''!=getUser();}
function loginSuccess(data){var ProfileHolder=$(parent.document).find('#profileOptionsHolder');if(null!=ProfileHolder){$(parent.document).find('.communityIn').show();$(parent.document).find('.communityOut').hide();$(parent.document).find('#poLinkVideos').attr('href','/'+data.sUsername+'/videos');$(parent.document).find('#poLinkFavorites').attr('href','/'+data.sUsername+'/favorites');$(parent.document).find('#poLinkGalleries').attr('href','/'+data.sUsername+'/galleries');$(parent.document).find('#poLinkFriends').attr('href','/'+data.sUsername+'/friends');$(parent.document).find('#poLinkWall').attr('href','/'+data.sUsername+'/comments');$(parent.document).find('#poLinkAbout').attr('href','/'+data.sUsername+'/info');$('#myAvatar').attr('src',data.sAvatar);ProfileHolder.find('em').text(data.sUsername);ProfileHolder.find('.profileImageHolder img').attr('src',data.sAvatar);ProfileHolder.find('a').attr('href','/'+data.sUsername+'/videos');setUser(data.sUsername);initProfileOptions();}
if(data.isConfirmed==true&&data.isRegistered==true){if($('.addComment').length>0)
$('.addComment').attr('style','display: block !important;');if($('.notLoggedInComment').length>0)
$('.notLoggedInComment').attr('style','display: none !important;');if($('.preventComments').length>0)
$('.preventComments').attr('style','display: none !important;');}else{if($('.addComment').length>0)
$('.addComment').attr('style','display: none !important;');if($('.notLoggedInComment').length>0)
$('.notLoggedInComment').attr('style','display: none !important;');if($('.preventComments').length>0){if(data.isConfirmed!=true){$('.preventComments').html(lang.get('ActivateYourAccountToPost'));}else if(data.isRegistered!=true){$('.preventComments').html(lang.get('FillOutAllFieldsToPost'));}
$('.preventComments').attr('style','display: block !important; height: 30px;');}}
if(data.action!=null&&(data.action=='add'||data.action=='del')){if(data.action=='add'){var favAddRemove=$(parent.document).find('#favAddRemove');favAddRemove.text('');favAddRemove.attr('class','favDelButton');favAddRemove[0].onclick=function(){removeFromFavorites(data.iObjectType,data.iObjectID,data.iObjectExtra)};}else if(data.action=='del'){var favAddRemove=$(parent.document).find('#favAddRemove');favAddRemove.text('');favAddRemove.attr('class','favAddButton');favAddRemove[0].onclick=function(){addToFavorites(data.iObjectType,data.iObjectID,data.iObjectExtra)};}}
if(data.iObjectID>0){if(data.action=='add'){addToFavorites(data.iObjectType,data.iObjectID,data.iObjectExtra);}else if(data.action=='del'){removeFromFavorites(data.iObjectType,data.iObjectID,data.iObjectExtra);}else if(data.isFavoriteObject){var favAddRemove=$(parent.document).find('#favAddRemove');favAddRemove.text('');favAddRemove.attr('class','favDelButton');favAddRemove[0].onclick=function(){removeFromFavorites(data.iObjectType,data.iObjectID,data.iObjectExtra)};}else{var favAddRemove=$(parent.document).find('#favAddRemove');favAddRemove.text('');favAddRemove.attr('class','favAddButton');favAddRemove[0].onclick=function(){addToFavorites(data.iObjectType,data.iObjectID,data.iObjectExtra)};}}
var communitySubNav=$(parent.document).find('#communityPage');if(communitySubNav.length>0){communitySubNav.html("<a id=\"linkProfile\" href='/"+data.sUsername+"' onclick=\"trackByCookie('stats_comm_subnavprofile');\">"+lang.get('My Profile')+"</a><a id=\"linkMembers\" href=\"/members\" onclick=\"trackByCookie('stats_comm_subnavmembers');\">"+lang.get('All Members')+"</a><a href=\"/community\" class=\"subnavLinks\">"+lang.get('Community')+"</a><a href=\"/pornstar\" class=\"subnavLinks\">"+lang.get('Pornstar Directory')+"</a>");}
$('span.comments_report_spam').show();if($('#galleryPhotos').length==1&&typeof ajaxPagination=='function'&&iPage){ajaxPagination('galleryPhotos',iPage,false);}
loginHide(iLoginReload,false);}
function loginHide(reload,clearCallback){bOpenedLogin=false;if(typeof(removeFavoriteCookie)=='function'){removeFavoriteCookie();}
if(typeof(showPlayer)=='function'){showPlayer();}
if(clearCallback==true){window.loginCallback=null;}
closeSlidePanel(sSlidePanelIndexLogin);if(typeof(window.loginCallback)=='function'){window.loginCallback();}
if(reload==1){top.location.replace(top.location);}else if(reload==3){window.top.location.href="/community";}}
var RTLoggedUser='';function setUser(user){RTLoggedUser=user;}
function getUser(){return RTLoggedUser;}
function loadUserProfile(){location.assign('/'+getUser());}
function loadUserVideos(){location.assign('/'+getUser()+'/myvideos');}
function loadHome(){location.assign('/');}
function loadingAnimation(el){var btnOriginalWidth=$('#'+el).css('width');if(btnOriginalWidth>=200){var btnWidth=btnOriginalWidth;}else{var btnWidth='200px';}
if($('#'+el).is(':hidden')){$('#'+el).show();$('#'+el+'Deact').hide();}else{if($('#'+el+'Deact').size()==0){$('#'+el).after($('<div>').attr('class','deactivating').attr('id',el+'Deact').html('<span><em>'+lang.get('PleaseWait')+'</em></span>').css('width',btnWidth));}
$('#'+el+'Deact').show();$('#'+el).hide();}}
function setTZCookies(){tmSummer=new Date(Date.UTC(2005,6,30,0,0,0,0));so=-1*tmSummer.getTimezoneOffset();tmWinter=new Date(Date.UTC(2005,12,30,0,0,0,0));wo=-1*tmWinter.getTimezoneOffset();$.cookie('RTTZOFFSET',so+"|"+wo,{expires:365});}
var sDesiredLocationAfterLogin='';function goToLocationAfterLogin(){if(undefined!=sDesiredLocationAfterLogin&&''!=sDesiredLocationAfterLogin)window.location.href=sDesiredLocationAfterLogin;return false;}
function logout(){$.ajax({url:"/logout",type:"POST",context:"document.body",dataType:"json",data:{},error:function(request,error){},success:function(data){if(data.success!=undefined){if(data.success==true){window.top.location.href="/";}}}});return false;}
function toggleAccountType(sel,unsel){var selRadio=document.getElementById('t'+sel);var unselRadio=document.getElementById('t'+unsel);selRadio.style.backgroundPosition='0% 50%';unselRadio.style.backgroundPosition='0% 0%';if(sel==1){document.getElementById('iconInfo').style.display='block';document.getElementById('accSubmit').disabled=true;document.getElementById('accSubmit').className='greySubmit';}else{document.getElementById('iconInfo').style.display='none';document.getElementById('accSubmit').disabled=false;document.getElementById('accSubmit').className='regSubmit';}}
function toggleTopLoginBlock(showLoginPanel){if(undefined==showLoginPanel){showLoginPanel=!$('.communityOut').is(':visible');}
if(showLoginPanel){$('.communityIn').hide();$('.communityOut').show();}else{$('.communityIn').show();$('.communityOut').hide();}}
function noGooglePlus(){$('.googlePlus').css('display','none');$('.topNavigation').addClass('long');}
function initTopNavigation(iFriendRequestsV,iMessagesV){var iUNwidth=$('#unamew').width();var iUNFontSize=10;var iUNHiddenFontSize=12;var iFriendRequests=iFriendRequestsV;var iMessages=iMessagesV;var iMaxWidth=167;$("#iconFriends em span").text(iFriendRequests==0?'':iFriendRequests).removeClass(iFriendRequests==0?'':'hide');$("#iconMessages em span").text(iMessages==0?'':iMessages).removeClass(iMessages==0?'':'hide');if(iFriendRequests==0)
$("#iconFriends em").addClass('hide');else
$("#iconFriends em").removeClass('hide');if(iMessages==0)
$("#iconMessages em").addClass('hide');else
$("#iconMessages em").removeClass('hide');for(var i=0;i<iFriendRequests.toString().length;i++){iMaxWidth-=6;}
for(var i=0;i<iMessages.toString().length;i++){iMaxWidth-=6;}
while(iUNwidth>=iMaxWidth&&iUNFontSize>7){iUNFontSize--;iUNHiddenFontSize--;$('#profileOptionsLink').css('font-size',iUNFontSize+'px');$('#unamew').css('font-size',iUNHiddenFontSize+'px');$('#profileOptionsHolder a em').css('padding-top','11px');if(iUNFontSize<8)
$('#profileOptionsHolder a em').css('padding-top','12px');iUNwidth=$('#unamew').width();}
$('#unamew').remove();if(0==iMessages)
$('#iconMessages').width(36);if(0==iFriendRequests)
$('#iconFriends').width(33);}
function reloadInitTopNavigation(){$.ajax({url:"/message/infodetails",type:"POST",context:"document.body",dataType:"json",error:function(request,error){return false;},success:function(data){if(data.success!=undefined){if(data.success===true){initTopNavigation(data.request,data.all);return false;}}else{alert('Undefined response!');}}});}
function setProfileOptionsPosition(){$('#profileOptions').css('left',$('#profileOptionsLink').offset().left-$('.topNavigation').offset().left-13);}
function initProfileOptions(){setProfileOptionsPosition();$('#profileOptionsLink').mouseover(function(){setProfileOptionsPosition();$('#profileOptions').show();$('.selectChannel').blur();});$('#profileOptionsLink').mouseleave(function(){$('#profileOptions').hide();});$('#profileOptions').mouseover(function(){$('#profileOptions').show();$('#profileOptionsLink').addClass('hover');});$('#profileOptions').mouseleave(function(){$('#profileOptions').hide();$('#profileOptionsLink').removeClass('hover');});if(isLogged()){reloadInitTopNavigation();setInterval(reloadInitTopNavigation,15000);}}
$(function(){$('.selectChannel').change(function(){var channel=$(this).val();if(channel==''){window.location.replace('/register/channel');}else{if(channel!=getUser())
switchChannel(channel);}});});function switchChannel(channel){$.ajax({url:"/_switch_to/"+encodeURIComponent(channel),type:"POST",context:"document.body",dataType:"json",error:function(request,error){alert('Network error.')},success:function(data){if(data.success==undefined){alert('Undefined response!');}else{if(data.success===true){window.location.replace('/'+encodeURIComponent(channel));}else{if('relog'==data.error){window.location.replace('/');}else{alert(data.error);}}}}});}
var sSlidePanelIndexAdvancedSearch='advancedSearch';function openAdvancedSearchWindow(){openSlidePanel({id:sSlidePanelIndexAdvancedSearch,url:'/advancedsearch',onload:function(){$("#searchField").autocomplete("close");$('#advancedSearchForm').submit(function(){$("#asCat").prop('disabled',false)})
if(typeof hideMembersAdvancedSearch!='undefined')
hideMembersAdvancedSearch();},onshow:function(){sliderInitLabels($("#slider-range-rating"));sliderInitLabels($("#slider-range-minutes"));sliderInitLabels($("#slider-range-views"));if(bGay){$("#asCat").val('gay');$("#asCat").prop('disabled',true);advancedSearchLikeTagUI.setTags(advancedSearchGayTags);advancedSearchDislikeTagUI.setTags(advancedSearchGayTags);}
try{advancedSearchLikeTagUI.setSelectedTags(eval($.cookie('advs_include_tags').replace(/\+/g,' ')));}catch(err){}
try{advancedSearchDislikeTagUI.setSelectedTags(eval($.cookie('advs_exclude_tags').replace(/\+/g,' ')));}catch(err){}
$("#asSt").focus();if($("#searchField").val()!=lang.get('Search'))
$("#asSt").val($("#searchField").val());}});}
var bAllowHideAdvancedSearch=true;function hideAdvancedSearch(){if(bAllowHideAdvancedSearch){bAllowHideAdvancedSearch=false;closeSlidePanel(sSlidePanelIndexAdvancedSearch);setTimeout("bAllowHideAdvancedSearch = true;",789);}}
function submitAdvancedSearch(){document.getElementById("srr-top-post").value=document.getElementById("srr-top").innerHTML.split(" ")[1];document.getElementById("srr-bottom-post").value=document.getElementById("srr-bottom").innerHTML.substr(document.getElementById("srr-bottom").innerHTML.lastIndexOf(" ")+1);document.getElementById("srm-top-post").value=document.getElementById("srm-top").innerHTML.split(" ")[1];document.getElementById("srm-bottom-post").value=document.getElementById("srm-bottom").innerHTML.substr(document.getElementById("srm-bottom").innerHTML.lastIndexOf(" ")+1);document.getElementById("srv-top-post").value=document.getElementById("srv-top").innerHTML.split(" ")[1];document.getElementById("srv-bottom-post").value=document.getElementById("srv-bottom").innerHTML.substr(document.getElementById("srv-bottom").innerHTML.lastIndexOf(" ")+1);document.getElementById("srv-top-post").value=document.getElementById("srv-top-post").value.replace(/,/g,"");document.getElementById("srv-bottom-post").value=document.getElementById("srv-bottom-post").value.replace(/,/g,"");trackByCookie(sAdvancedSearchSubmitTrackKey);}
function removeAdvancedSearchGayLock(){if(typeof(advancedSearchLikeTagUI)!="undefined"){advancedSearchLikeTagUI.setTags(advancedSearchTags,true);advancedSearchDislikeTagUI.setTags(advancedSearchTags,true);$("#asCat").prop('disabled',false)
$("#asCat").val('');}}
function gotoPageAdvancedSearch(page,action){var $form=$('#hiddenAdvancedSearchFormId');if(typeof(action)!='undefined'){$form.prop('action','/'+action);}
$form.find('input[name=page]').val(page);$form.submit();return false;}
function resetSearch(){if(!$('#asCat').prop('disabled')){$('#asCat').val("");}
advancedSearchLikeTagUI.clear();advancedSearchDislikeTagUI.clear();$('#advancedSearch .rtSliderStyle .slider').each(function(){sliderReset($(this));});$('#asPublishedWeek').prop('checked',false);$('#asPublishedMonth').prop('checked',false);$('#asPublishedYear').prop('checked',false);$('#asPublishedAll').prop('checked',true);$.cookie("advs_category",null,{path:"/",domain:sCookieDomain});$.cookie("advs_include_tags",null,{path:"/",domain:sCookieDomain});$.cookie("advs_exclude_tags",null,{path:"/",domain:sCookieDomain});$.cookie("advs_min_rating",null,{path:"/",domain:sCookieDomain});$.cookie("advs_max_rating",null,{path:"/",domain:sCookieDomain});$.cookie("advs_min_duration",null,{path:"/",domain:sCookieDomain});$.cookie("advs_max_duration",null,{path:"/",domain:sCookieDomain});$.cookie("advs_min_views",null,{path:"/",domain:sCookieDomain});$.cookie("advs_max_views",null,{path:"/",domain:sCookieDomain});$.cookie("advs_publishdate",null,{path:"/",domain:sCookieDomain});}
function ageVerified(){setCookie('cookAV','1',30);if(document.getElementById('avOverlayHolder'))document.getElementById('avOverlayHolder').className='hide';if(document.getElementById('contentHolder'))document.getElementById('contentHolder').className='contentHolder show';track(2,'enter');}
var auto=function(iClass){$("#searchField").autocomplete({minLength:0,source:function(request,response){var limit=10;if((typeof iVideoID!=='undefined')&&(iVideoID>0))
limit=3;jQuery.ajax({url:"/searchsuggest?iClass="+iClass+"&limit="+limit,dataType:"json",data:{"term":request.term},success:function(data){response(jQuery.map(data,function(item){return{id:item.id,label:request.term.length>0?__highlight(item.label,request.term):item.label,value:item.value};}));}});},open:function(event,ui){$(".ui-autocomplete .aSearchLink a").unbind("mouseover");$(".ui-autocomplete .aSearchLink a").unbind("mouseout");$(".ui-autocomplete .aSearchLink").css("border-top","1px solid #3D3D3D");},select:function(event,ui){if(ui.item.label=='advanced_search'){openAdvancedSearchWindow();return;}
trackByCookie(sSuggestionTrackKey);$("#searchField").val(ui.item.value);$("form[name=searchform]").submit();}}).data("autocomplete")._renderItem=function(ul,item){if(item.label=='advanced_search'){return $('<li></li>').data("item.autocomplete",item).addClass('aSearchLink').append($('<a></a>').html(lang.get('AdvancedSearch')).click(function(){openAdvancedSearchWindow();return false;})).appendTo(ul);}
return $("<li></li>").data("item.autocomplete",item).append($("<a></a>").html(item.label)).appendTo(ul);};$("#searchField").focus(function(){if(this.value==lang.get('Search'))
this.value='';if(this.value=='')
$("#searchField").autocomplete('search','');else
$("#searchField").autocomplete('search');});$("#searchField").blur(function(){if(this.value=='')
this.value=lang.get('Search');});};function __highlight(str,term){if(str=="advanced_search")
return str;var matcher=new RegExp("("+jQuery.ui.autocomplete.escapeRegex(term)+")","ig");return str.replace(matcher,"<b>$1</b>");}
function $$(i){return document.getElementById(i);}
function Menu(wrap,sub){this.grey='0';this.transparent='0';this.chromaFix='chroma(color=#929292)';this.opened=false;this.closedFromMenu=false;this.wrap=$$(wrap);this.sub=$$(sub);this.o=false;this.fake=$$('closeCategories');this.a=this.wrap.getElementsByTagName('a')[0];this.p=this.a.parentNode;this.outed=null;this.init();}
Menu.prototype.init=function(){var self=this;this.a.onmouseover=function(){self.o=true;var aa=this;setTimeout(function(){if(self.o){self.sub.style.display=self.opened?'none':'block';self.p.style.border=self.opened?self.grey:self.transparent;aa.className='active';self.outed=null;}},200);};this.a.onmouseout=function(){self.o=false;self.outed=true;setTimeout(function(){self.close();},500);};this.sub.onmouseover=function(){self.outed=null;};this.sub.onmouseout=function(){self.outed=true;setTimeout(function(){self.close();},500);};if(this.fake){this.fake.onmouseover=function(){self.sub.style.display=self.opened?'none':'block';self.p.style.border=self.opened?self.grey:self.transparent;$$('categoriesLink').className='active';self.outed=null;};this.fake.onmousedown=function(){self.outed=!self.outed;if(self.outed==true){setTimeout(function(){self.close();},500);}
else{self.sub.style.display=self.opened?'none':'block';self.p.style.border=self.opened?self.grey:self.transparent;$$('categoriesLink').className='active';self.outed=null;}};}};Menu.prototype.close=function()
{if(this.outed!=null)
{this.opened=false;this.p.style.border='';this.a.className='';this.sub.style.display='none';this.sub.style.filter="chroma(color=#929292)";}};var ajaxPaginationURL=new Array();var allow_ajaxPagination=true;function ajaxPagination(contentBox,page,scroll){if(allow_ajaxPagination){allow_ajaxPagination=false;var sURL=ajaxPaginationURL[contentBox]+'/'+page;$.ajax({url:sURL,type:"GET",context:"document.body",dataType:"json",error:function(request,error){allow_ajaxPagination=true;return false;},async:false,success:function(data){if(data.success!=undefined){if(data.success===true){$('#'+contentBox).empty().append(data.html);if(scroll)
$('html, body').animate({scrollTop:$('#'+contentBox).offset().top},750);}else if(data.success===false){alert(data.errorMessage);}}else{alert('Unrecognized server responce');}
allow_ajaxPagination=true;}});}
return true;}
function offlinePagination(sectionWithPages,page,scroll){currentPage=page;if(page<=iPages){if(scroll)
$('html, body').animate({scrollTop:$('#all_'+sectionWithPages).offset().top-220},500);$('a[class="'+sectionWithPages+'Page currentPage"]').removeClass('currentPage');$('#'+sectionWithPages+'Page_'+page).addClass('currentPage');$('div[name="'+sectionWithPages+'"]').addClass('hide');$('#'+sectionWithPages+'_'+page).removeClass('hide');$('#navPrev').addClass('hide');$('#navNext').addClass('hide');$('#'+sectionWithPages+'PageNumbersHolder').html('');if(iPages>1){var middlePage=4;if(page>4){middlePage=page;if(middlePage>(iPages-3))
middlePage=(iPages-3);}
var start=1;if(start<(middlePage-3))
start=(middlePage-3);var end=iPages;if(end>(middlePage+3))
end=(middlePage+3);var pageNumbersHolderHTML='';pageNumbersHolderHTML+='<span id="navPrevSpan" class="navigate">'+lang.get('Previous')+'</span>';pageNumbersHolderHTML+='<a id="navPrevLink" href="javascript:;" onclick="offlinePagination(\''+sectionWithPages+'\', prevPage, true)" class="navigate hide">'+lang.get('Previous')+'</a>';for(var j=start;j<=end;j++){pageNumbersHolderHTML+='<a href="javascript:;" onclick="offlinePagination(\''+sectionWithPages+'\', '+j+', true)" class="'+sectionWithPages+'sPage'+((j==page)?' currentPage':'')+'" id="'+sectionWithPages+'Page_'+j+'">'+j+'</a>';}
pageNumbersHolderHTML+='<a id="navNextLink" href="javascript:;" onclick="offlinePagination(\''+sectionWithPages+'\', nextPage, true)" class="navigate hide">'+lang.get('Next')+'</a>';pageNumbersHolderHTML+='<span id="navNextSpan" class="navigate">'+lang.get('Next')+'</span>';$('#'+sectionWithPages+'PageNumbersHolder').html(pageNumbersHolderHTML);if(page>1){prevPage=page-1;$('#navPrevSpan').addClass('hide');$('#navPrevLink').removeClass('hide');}
if(page<iPages){nextPage=page+1;$('#navNextSpan').addClass('hide');$('#navNextLink').removeClass('hide');}}}}
var ratingDescrElement=null;var ratingDescrHTML=null;var ratingsOriginalHTML=null;function getRatingsDiv(){if(ratingDescrHTML==null){ratingDescrHTML=document.getElementById('ratingDescr');}
if(ratingsOriginalHTML==null){ratingDescrElement=document.getElementById('ratingDescr');if(ratingDescrElement!=null)
ratingsOriginalHTML=ratingDescrElement.innerHTML;}}
function getVarForRating(id){getRatingsDiv();if(window['allowRating_'+id]==undefined){window['allowRating_'+id]=1;}
return window['allowRating_'+id];}
function ratingShowStars(i,id){if(getVarForRating(id)){for(j=1;j<=5;j++){if(j<=i)
document.getElementById('stb'+j+'_'+id).src=document.getElementById('sb2o').src;else
document.getElementById('stb'+j+'_'+id).src=document.getElementById('sb0o').src;}
if(typeof(ratingDescrHTML)!='undefined'&&ratingDescrHTML!=null){var ratingDescr=new Array(lang.get('Boring'),lang.get('WishyWashy'),lang.get('Average'),lang.get('Yummy'),lang.get('Awesome'));ratingDescrHTML.innerHTML='<span style="color: white">'+ratingDescr[i-1]+'</span>';}}}
function ratingOriginalStars(i,id){if(getVarForRating(id)){for(j=1;j<=5;j++){document.getElementById('stb'+j+'_'+id).src=document.getElementById('sb'+window['currentStars_'+id][j-1]).src;}
if(typeof(ratingDescrHTML)!='undefined'&&ratingDescrHTML!=null){ratingDescrHTML.innerHTML=ratingsOriginalHTML;}}}
var allowSaveRating=true;function saveRating(iObjectType,iObjectID,iRate){if(getVarForRating(iObjectID)){if(allowSaveRating&&iObjectType>0&&iObjectID>0&&iRate>0){allowSaveRating=false;$.ajax({url:"/rate",type:"POST",context:"document.body",dataType:"json",data:{'object_type':iObjectType,'object_id':iObjectID,'rate':iRate},error:function(request,error){allowSaveRating=true;},success:function(){}});}
window['allowRating_'+iObjectID]=0;if(typeof(ratingDescrHTML)!='undefined'&&ratingDescrHTML!=null){ratingDescrHTML.innerHTML=lang.get('ThankYou');}
var ratingsNum=document.getElementById('ratingsNum');if(typeof(ratingsNum)!='undefined'&&ratingsNum!=null){ratingsNum.innerHTML=window['ratings_'+iObjectID].formatMoney(0,'.',',')+' ';}}}
var bGay=false;var sSuggestionTrackKey='';var iVideoClass=0;function submitSearch(){var sf=document.getElementById('searchField');if(sf.value==lang.get('Search')){sf.value="";}
if(bGay){document.searchform.action="/gay/";}else{document.searchform.action="/";}
document.searchform.submit();}
function rollOverGayButton(className){$('#gayTag').attr({'class':className});}
function closeGayButton(){bGay=false;$('#searchField').width(177);$('#searchField').css({paddingLeft:'5px'});$('#gayTag').remove();$('#searchField').val('');$('#searchField').val(lang.get('Search'));auto(iVideoClass);removeAdvancedSearchGayLock();}
$(document).ready(function(){$('#gayLabel').mouseover(function(){rollOverGayButton('gay_gay_hover');});$('#gayX').mouseover(function(){rollOverGayButton('gay_x_hover');});$('#gayLabel').mouseout(function(){rollOverGayButton('gay_normal');});$('#gayX').mouseout(function(){rollOverGayButton('gay_normal');});$('#gayLabel').click(function(){window.location.href='/redtube/gay/';});$('#gayX').click(function(){closeGayButton();});});String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");};String.prototype.capitalize=function(){return this.toLowerCase().replace(/(^|\s)([a-z])/g,function(m,p1,p2){return p1+p2.toUpperCase();});};function tagsSuggest(arr)
{for(var i=0;i<arr.length;i++){if(arr[i]=='Bareback'){arr[i]="Bareback (gay)";}}
this.tags=arr;this.original=arr;this.getUsedItems=function(){return this.original.length-this.tags.length;};this.search=function(tagName)
{if(tagName.trim().indexOf(",")!=-1){return new Array();}
if(tagName.trim()==""){return this.tags;}
tagName=this.escape(tagName);tagName=tagName.toLowerCase();var found=new Array();var searchStr=','+this.tags.join(',')+',';var searchRegex=new RegExp('[^,]*?>'+tagName+'<[^,]*','gi');var matches=searchStr.replace(new RegExp('\\b('+tagName+')','gi'),'<span>$&</span>').match(searchRegex);if(matches==null){return found;}
return matches;};this.getAll=function()
{return this.tags;};this.exact=function(tagName)
{if(tagName.trim()==""||this.tags.length==0||tagName.trim()==","){return false;}
tagName=this.escape(tagName);var searchStr=','+this.tags.join(',')+',';var searchRegex=new RegExp(','+tagName+',','gi');var matches=searchStr.match(searchRegex);if(matches!=null&&matches.length==1){return matches[0].substring(1,matches[0].length-1);}
return false;};this.remove=function(tagName){if(this.tags!=null){tagName=this.escape(tagName);var searchStr=','+this.tags.join(',')+',';var searchRegex=new RegExp(','+tagName+',');searchStr=searchStr.replace(searchRegex,',');this.tags=(searchStr.substring(1,searchStr.length-1)).split(',');if(this.onchange!=undefined)this.onchange();}};this.escape=function(tagName)
{return tagName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");};this.add=function(tagName)
{this.remove(tagName);this.tags.push(tagName);this.tags.sort();};this.clear=function()
{this.tags=this.original;};this.validateTag=function(tagName){if(tagName=='Bareback')tagName='Bareback (gay)';if(tagName=='Young &amp; Old')tagName='Young & Old';return-1!=$.inArray(tagName,this.original);};}
function tagUI(options)
{this.keys={BACKSPACE:8,ENTER:13,SPACE:32,COMMA:44,UP:38,DOWN:40};var self=this;if(!document.getElementById(options.suggest.id)){var sugg=document.createElement('div');sugg.className=options.suggest.className;sugg.id=options.suggest.id;document.body.appendChild(sugg);}
else{var sugg=$('#'+options.suggest.id);}
this.suggest=$(sugg);this.item=options.item;this.div=$(options.item).parents('div:eq(0)');this.ul=$(options.item).parents('ul:eq(0)');this.tag=options.tag;this.holder=options.holder;this.term=options.def;this.index=-1;this.deleting=false;this.clicked=false;this.hintSpan=false;this.hint=options.hint;this.keyup=false;this.canClose=true;this.uiEnabled=true;this.hasFocus=true;this.lock=0;this.lastItem=false;this.replace=options.replace!=undefined?options.replace:0;this.callBackAfterAddItem=function(){};this.loadSuggestionsAfterAdd=(options.loadAfterAdd!=undefined)?options.loadAfterAdd:true;this.maxUsedItems=(options.maxItems!=undefined)?options.maxItems:0;this.limitLines=(options.limitLines!=undefined)?options.limitLines:false;this.inputName=(options.inputName!=undefined)?options.inputName+'[]':this.holder.attr('id')+'[]';this.minLength=(options.minLength!=undefined)?options.minLength:1;this.hideFullList=(options.hideFullList!=undefined)?options.hideFullList:false;if(options.limit!=undefined){this.tag.limit=options.limit;}
if(options.onchange!=undefined){this.onchange=options.onchange;this.tag.onchange=options.onchange;}
this.div.click(function(e){self.hasFocus=false;if(e.target.tagName=="A"){var $a=$(e.target);self.removeSelectedTag($a);$(self.item).val("");$(self.item).focus();self.lastItem=false;self.limitLine();}
self.item.focus();});this.item.blur(function(e){if(self.uiEnabled){if(self.canClose){self.showHint();self.suggest.css({display:"none"});self.index=-1;}
else{$(this).focus();}}else{$(this).focus();}});this.item.focus(function(e){if(self.hasFocus==false){self.hasFocus=true;self.focus(e);}});this.item.keydown(function(e){if(self.replace&&self.lastItem){e.preventDefault();e.returnValue=false;return;}
if(self.uiEnabled){self.hideHint();if(e.which==self.keys.ENTER||e.which==self.keys.UP||e.which==self.keys.DOWN||(self.item.val().trim()==""&&e.which==32)){e.preventDefault();e.returnValue=false;if(e.which==self.keys.ENTER){var result=self.tag.exact($(this).val());if(result){self.addItem(result);return;}}
if(self.suggestItems()>=0&&e.which==self.keys.ENTER&&self.index!=-1){var a=document.getElementById($(self.suggest).attr("id")).getElementsByTagName("a")[self.index];if(a!=undefined){var rel=$(a).attr("rel");if(rel!=''){self.addItem(rel);self.index=-1;}else{document.getElementById($(self.suggest).attr("id")).style.display='none';}}}}else if(e.which==self.keys.BACKSPACE){if(self.item.val().trim()==""){e.preventDefault();e.returnValue=false;}
self.suggest.css({display:'none'});self.deleting=self.item.val()=="";}else{var current_string=$(this).val();var search=self.tag.search(current_string);if(search.length==0){e.preventDefault();e.returnValue=false;}}}else{e.preventDefault();e.returnValue=false;}});this.item.keypress(function(e){if(self.replace&&self.lastItem){e.preventDefault();e.returnValue=false;return;}
if(e.keyCode==self.keys.ENTER||e.keyCode==self.keys.UP||e.keyCode==self.keys.DOWN||!self.uiEnabled){if(navigator.appName.indexOf('Opera')!=-1){e.preventDefault();e.returnValue=false;}}else{if(navigator.appName.indexOf('Opera')!=-1){var result=self.tag.search($(this).val());self.lock=1;if(result.length==0){e.preventDefault();e.returnValue=false;}}}});this.item.keyup(function(e){if(self.replace&&self.lastItem){e.preventDefault();e.returnValue=false;return;}
if(self.uiEnabled){if(e.which==self.keys.UP||e.which==self.keys.DOWN)
{self.focusIndex(e.which);}
else{if($(this).val().length<self.minLength)return;var result=self.tag.search($(this).val());self.lock=1;if(result.length>0){self.lock=0;self.suggest.html("");self.suggest.css({display:"block"});var pos=self.getSuggestPosition();self.suggest.css({left:pos.l,top:pos.t});var all='';for(var i=0;i<result.length;i++){if(self.lock){return;}
if(result[i].trim()!=""){var a=document.createElement('a');a.href="javascript:;";a.rel=result[i].replace(/<span>/g,'').replace(/<\/span>/g,'').replace("'","&#39;");a.innerHTML=result[i];document.getElementById(self.suggest.attr('id')).appendChild(a);}}
$(self.suggest).find('a').mousedown(function(e){self.addItem($(this).attr('rel'));self.index=-1;});self.fixIEHeight();self.index=-1;self.focusIndex(self.keys.DOWN);}else{var l=self.item.val();if(l.length>0){while(self.item.val().trim().length>0){var search=self.tag.search(self.item.val());if(search.length==0){var curr=self.item.val();var newOne=self.item.val().substring(0,self.item.val().length-1);self.item.val(newOne);}else{self.searchVal();break;}}}
if(self.item.val().trim().length==0){self.suggest.css({display:"none"});self.index=-1;}
return false;}
return;}
if(self.keys.BACKSPACE==e.which&&$(this).val().trim()!=""){self.searchVal();}}});this.suggest.mouseenter(function(e){self.canClose=false;});this.suggest.mouseleave(function(e){self.canClose=true;});this.showHint();}
tagUI.prototype.removeSelectedTag=function(tag){if(typeof(tag)=='string'){removeSelectedTags([tag]);return;}
var $a=tag;var tagName=$a.attr("rel");this.tag.add(tagName);$a.parent().remove();this.setItems();};tagUI.prototype.removeSelectedTags=function(tags){if(typeof(tags)=='undefined'){tags=false;}
tagUI.self=this;$(this.div).find('ul a').each(function(){var tagName=$(this).attr('rel');if(tags&&!$.inArray(tagName,tags))return;self.tag.add(tagName);$(this).parent().remove();});this.setItems();};tagUI.prototype.filterSelectedTags=function(){self=this;$(this.div).find('ul a').each(function(){var tagName=$(this).attr('rel');if(self.tag.validateTag(tagName))return;$(this).parent().remove();});this.setItems();};tagUI.prototype.closeSuggestWindow=function(){this.suggest.html('');this.suggest.css({display:"none"});this.index=-1;};tagUI.prototype.searchVal=function()
{var self=this;var result=self.tag.search($(this.item).val());self.lock=1;if(result.length>0&&$(this.item).val()!=""){self.lock=0;self.suggest.html("");self.suggest.css({display:"block"});var pos=self.getSuggestPosition();self.suggest.css({left:pos.l,top:pos.t});var all='';for(var i=0;i<result.length;i++){if(self.lock){return;}
if(result[i].trim()!=""){var a=document.createElement('a');a.href="javascript:;";a.rel=result[i].replace(/<span>/g,'').replace(/<\/span>/g,'');a.innerHTML=result[i];document.getElementById(self.suggest.attr('id')).appendChild(a);}}
$(self.suggest).find('a').mousedown(function(e){self.addItem($(this).attr('rel'));self.index=-1;});self.fixIEHeight();self.index=-1;self.focusIndex(self.keys.DOWN);}else{self.suggest.css({display:"none"});self.index=-1;}};tagUI.prototype.enable=function()
{this.uiEnabled=true;$(this.item).css('display','block');};tagUI.prototype.limitLine=function()
{if(this.limitLines>0&&this.maxHeight==undefined){this.maxHeight=(this.limitLines+1)*18;}
if(this.limitLines>0){if(this.maxHeight!=undefined&&this.maxHeight<=$(this.ul).outerHeight()){while(this.maxHeight<=$(this.ul).outerHeight()){var last=$('#'+this.ul.attr('id')+' li.tag_item:last');var h=last.find('a').attr('rel');this.tag.add(h);$(last).remove();this.setItems();$(this.item).val("");$(this.item).focus();this.lastItem=false;}
return true;}}
return false;};tagUI.prototype.focus=function(e)
{var self=this;if(self.uiEnabled){var w=$(self.div).width()-4;$(self.suggest).css({width:w});if(e.target.tagName!="A"){self.hideHint();$(self.suggest).html('');if(self.hideFullList==false){this.loadSuggestions();}}
else if(!hasFocus||(e.target.tagName!="A"&&e.target.tagName!="INPUT")){$(self.item).focus();}}};tagUI.prototype.loadSuggestions=function()
{if(this.maxUsedItems>0&&this.tag.getUsedItems()>=this.maxUsedItems){return;}
var self=this;var result=self.tag.getAll();self.lock=1;if(result.length>0){self.lock=0;self.suggest.html("");self.suggest.css({display:"block"});var pos=self.getSuggestPosition();self.suggest.css({left:pos.l,top:pos.t});var all='';for(var i=0;i<result.length;i++){if(self.lock){return;}
if(result[i].trim()!=""){var a=document.createElement('a');a.href="javascript:;";a.rel=result[i].replace(/<span>/g,'').replace(/<\/span>/g,'');a.innerHTML=result[i];document.getElementById(self.suggest.attr('id')).appendChild(a);}}
$(self.suggest).find('a').mousedown(function(e){self.addItem($(this).attr('rel'));self.index=-1;});self.index=-1;self.focusIndex(self.keys.DOWN);}
$(self.suggest).css('display','block');var pos=self.getSuggestPosition();self.suggest.css({left:pos.l,top:pos.t});var end=new Date().getTime();};tagUI.prototype.disable=function()
{this.uiEnabled=false;$(this.item).css('display','none');$(this.suggest).css('display','none');};tagUI.prototype.focusIndex=function(arrow)
{if(arrow==this.keys.UP){if(this.index>0){this.index--;}}
else if(arrow==this.keys.DOWN){if(this.index+1<=this.suggestItems()){this.index++;}}
this.selectIndex();};tagUI.prototype.fixIEHeight=function()
{if(this.suggest.height()>290){this.suggest.css({height:290});}else{this.suggest.css({height:'auto'});}};tagUI.prototype.suggestItems=function()
{var id=$(this.suggest).attr("id");var root=document.getElementById(id);var items=root.getElementsByTagName('a');var length=items.length;return length-1;};tagUI.prototype.selectIndex=function()
{var id=$(this.suggest).attr("id");var root=document.getElementById(id);var items=root.getElementsByTagName('a');var length=items.length;for(var i=0;i<length;i++){$(items[i]).attr('class','');if(i==this.index){$(items[i]).attr('class','selected_autocomplete');try{var scroller=($(items[i]).height()+8)*(i-1);$(this.suggest).scrollTo(scroller,0);}
catch(e){}}}};tagUI.prototype.addItem=function(val)
{if(this.limitLine()){return false;}
this.addItemInit(val);if(this.limitLine()){return false;}
if(this.loadSuggestionsAfterAdd){if(self.hideFullList==false){this.loadSuggestions();}}};tagUI.prototype.addItemInit=function(val)
{if(this.replace&&this.lastItem){return;}
if(this.hintSpan){this.hideHint();}
if(val=='Bareback'){val='Bareback (gay)';}
var replaced=val.replace("&amp;","&").replace('&#39;',"'");$(this.item).val("");this.tag.remove(replaced);this.suggest.html("");this.suggest.css({display:"none"});var ul_id=$(this.ul).attr('id');var last_li=$(this.ul).find('li:last-child');$("<li class='tag_item'><span class='item'>"+replaced.replace(' ','&nbsp;')+"</span><a rel='"+replaced.replace("'",'&#39;')+"' href='javascript:;'></a></li>").insertBefore(last_li);this.setItems();if(this.onchange!=undefined)this.onchange();this.canClose=true;this.lastItem=val;this.callBackAfterAddItem();this.limitLine();};tagUI.prototype.setItems=function()
{var self=this;$(this.holder).html('');var as=$(this.div).find('ul a');for(var i=0;i<as.length;i++){var tagName=$(as[i]).attr('rel');if(tagName=='Bareback (gay)'){tagName='Bareback';}
self.holder.append('<input type="hidden" name="'+self.inputName+'" value="'+tagName+'" />');}};tagUI.prototype.getItems=function()
{var items=new Array();var as=$(this.div).find('ul a');for(var i=0;i<as.length;i++){var tagName=$(as[i]).attr('rel');if(tagName=='Bareback (gay)'){tagName='Bareback';}
items.push(tagName);}
return items;};tagUI.prototype.foundInCurrentItems=function(str)
{var items=this.getItems();for(var i=0;i<items.length;i++){if(items[i]==str){return true;}}
return false;};tagUI.prototype.setHint=function(msg)
{this.hint=msg;this.showHint();};tagUI.prototype.showHint=function()
{if(this.hintSpan)return;if(typeof(this.hint)=='undefined')return;if($(this.ul).find("a").length>0)return;$(this.item).val('');var span=document.createElement('span');span.className='margoin';span.innerHTML=this.hint;this.hintSpan=span;$(span).insertBefore(this.ul);};tagUI.prototype.hideHint=function()
{if(!this.hintSpan)return;$(this.hintSpan).remove();this.hintSpan=false;};tagUI.prototype.resetHint=function()
{var haveSelectedItems=$(this.ul).find("a").length>0;var hasHint=this.hint!='';var isShownHint=this.hintSpan;if(isShownHint&&(haveSelectedItems||!hasHint)){$(this.hintSpan).remove();}
if(!isShownHint&&!haveSelectedItems&&hasHint){this.showHint();}};tagUI.prototype.addCallbackAfterAddItem=function(callbackFunction){if(typeof(callbackFunction)=='function'){this.callBackAfterAddItem=callbackFunction;}};tagUI.prototype.clear=function()
{this.canClose=true;this.tag.clear();this.deleting=false;$(this.holder).html('');$(this.ul).find('li.tag_item').remove();this.showHint();if(this.onchange!=undefined)this.onchange();};tagUI.prototype.setTags=function(newTags,keepSelected)
{this.tag=newTags;if(typeof(keepSelected)!='undefined'&&keepSelected){this.filterSelectedTags();}else{this.removeSelectedTags();}
this.resetHint();};tagUI.prototype.getSuggestPosition=function(){var l=this.div.offset().left;var t=this.div.offset().top+this.div.height()+1;if($.browser.msie&&$.browser.version<8){t+=document.documentElement.scrollTop;}
return{t:t,l:l}};tagUI.prototype.setSelectedTags=function(selectedTags,keepOld)
{if(typeof(keepOld)!='undefined'||!keepOld){this.removeSelectedTags();}
if(typeof(selectedTags)=='string')selectedTags=[selectedTags];for(i in selectedTags){if(this.tag.validateTag(selectedTags[i]))this.addItemInit(selectedTags[i]);}
this.resetHint();};var pics=new Array();var stat=new Array();var pic=new Array();function changepic(i,code,prefix){var loop=0;var h;while((pics[code][i]==0||i>=16)&&loop<100){if(i>=16){i=0;}else{i++;}
loop++;}
if(pic[code][i].complete){if(prefix!=null){document.getElementById(prefix).src=pic[code][i].src;h=setTimeout("changepic("+(i+1)+",'"+code+"', '"+prefix+"')",500);}else{document.getElementById(code).src=pic[code][i].src;h=setTimeout("changepic("+(i+1)+",'"+code+"')",500);}}else{if(prefix!=null)
h=setTimeout("changepic("+i+",'"+code+"', '"+prefix+"')",20);else
h=setTimeout("changepic("+i+",'"+code+"')",20);}
stat[code]=h;}
function loadpic(url,code,j){if(stat[code]){pic[code][j].src=url;}}
function startm(code,ta,te,prefix){stat[code]=true;var jj,jjj;var first=1;for(var j=0;j<16;j++){if(pics[code][j]==1){pic[code][j]=new Image();jj=j+1;if(jj>=100)jjj=""+jj;if(jj<100&&jj>=10)jjj="0"+jj;if(jj<10)jjj="00"+jj;if(first){first=0;loadpic(ta+jjj+te,code,j);if(prefix!=null){document.getElementById(prefix).title="";document.getElementById(prefix).parentNode.title="";}else{document.getElementById(code).title="";document.getElementById(code).parentNode.title="";}}else{setTimeout("loadpic('"+ta+jjj+te+"','"+code+"',"+j+")",j*50);}}}
if(prefix!=null)
changepic(0,code,prefix);else
changepic(0,code);}
function endm(code){if(stat[code]){clearTimeout(stat[code]);stat[code]=false;}}
function thumb_action(id,cmd,priv){var opacity=document.getElementById('xop_'+id);var confirm=document.getElementById('xconf_'+id);var button=document.getElementById('but_'+id);var div_button=document.getElementById('xbut_'+id);if(priv!=null&&priv==1){var priv_tag=document.getElementById('xpriv_'+id);}else if(priv==2){var msg_tag=document.getElementById('xmsg_'+id);}
switch(cmd){case'over':div_button.style.display='block';if(priv!=null&&priv==1)priv_tag.style.display='block';break;case'out':div_button.style.display='none';if(priv!=null&&priv==1)priv_tag.style.display='none';break;case'delete':if(priv!=2)opacity.style.display='block';confirm.style.display='block';button.style.display='none';$('#smf_'+id).hide();if(priv==2)msg_tag.style.display='none';break;case'reject':if(priv!=2)opacity.style.display='none';confirm.style.display='none';button.style.display='block';$('#smf_'+id).show();if(priv==2)msg_tag.style.display='block';break;}}
function rotateCatThumb(code,ta,te){stat[code]=1;var jj,jjj;var first=1;pic[code][0]=new Image();pic[code][0].src="http://img01.redtubefiles.com/_thumbs/categories/s115x85/category_img_01.gif";for(var j=1;j<16;j++)
{if(pics[code][j]==1)
{pic[code][j]=new Image();jj=j+1;if(jj>=100){jjj=""+jj;}
if(jj<100&&jj>=10){jjj="0"+jj;}
if(jj<10){jjj="0"+jj;}
if(first){first=0;loadpic(ta+jjj+te,code,j);document.getElementById(code).title="";document.getElementById(code).parentNode.title="";}
else{setTimeout("loadpic('"+ta+jjj+te+"','"+code+"',"+j+")",j*50);}}}
changepic(0,code);}
function resetCatThumb(id){endm(id);var image=document.getElementById(id);if(image){image.src='http://img01.redtubefiles.com/_thumbs/categories/s115x85/category_img_01.gif';}}
function getFlashMovieObject(movieName){if(window.document[movieName]){return window.document[movieName];}
if(navigator.appName.indexOf("Microsoft Internet")==-1){if(document.embeds&&document.embeds[movieName])
return document.embeds[movieName];}
else{return document.getElementById(movieName);}
return null;}
function showFlashContainer(){var flash=jQuery("#flashThumb");var reference=jQuery("#"+flash.data("refImageId"));flash.offset(reference.offset());}
function track(action,param){$.ajax({url:'/trackstats?iAction='+action+'&sParam='+param});}
function trackByCookie(counterName){setCookie('trackCC',counterName,1);}
var allowSimpleAJAX=[];function simpleAJAX(sURL,sContainer){if(typeof allowSimpleAJAX[sURL]=='undefined'||allowSimpleAJAX[sURL]){allowSimpleAJAX[sURL]=false;$.ajax({url:sURL,type:"GET",context:"document.body",dataType:"json",error:function(request,error){allowSimpleAJAX[sURL]=true;alert('Error 1001: Failed loading content...');},success:function(data){allowSimpleAJAX[sURL]=true;if(data.success==undefined){alert('Error 1002: Unexpected responce...');}else if(!data.success){alert('Error 1003: Failed loading content...');}else if(data.html==undefined){alert('Error 1004: Failed loading content...');}else{$('#'+sContainer).html(data.html);}}});}}
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(searchElement){"use strict";if(this===void 0||this===null){throw new TypeError();}
var t=Object(this);var len=t.length>>>0;if(len===0){return-1;}
var n=0;if(arguments.length>0){n=Number(arguments[1]);if(n!==n){n=0;}else if(n!==0&&n!==Infinity&&n!==-Infinity){n=(n>0||-1)*Math.floor(Math.abs(n));}}
if(n>=len){return-1;}
var k=n>=0?n:Math.max(len-Math.abs(n),0);for(;k<len;k++){if(k in t&&t[k]===searchElement){return k;}}
return-1;};}
function fixTextLength(id,height){var obj=$('#'+id);var html=obj.html();var len=html.length;while(obj.height()>height){cutPosition=html.lastIndexOf(' ');if(!cutPosition)cutPosition=html.length-1;html=html.substring(0,cutPosition);obj.html(html+'...');}}
function langClass(){this.langLabels=[];this.add=function(label,text){if(typeof(this.langLabels[label])=='undefined')
this.langLabels[label]=text;}
this.get=function(label){return(this.langLabels[label])?this.langLabels[label]:label;}};function rotateThumbsClass(img){this.oIMG=img;this.oHolder=this.oIMG.parent();this.aImages=new Array();this.sID='';this.sThumbsServer='http://img0'+Math.floor((Math.random()*4)+1)+'.redtubefiles.com/_thumbs/';this.sFolder='';this.sImgSize='m';this.sBorderOver='1px solid #CC0D12';this.sBorderOut='1px solid #A0A0A0';this.sContainer='thumbsRotate';this.sPreparedThumbs='videoThumbs';this.aPreparedThumbs=new Array();this.sTitle='';this.iSpeed=500;this.iLeft=182;this.iShowImg=0;this.oInterval='';this.skip=false;this.load=function(){if(!this.sID)
this.sID=this.oIMG.attr('id');this.sTitle=this.oHolder.attr('title');if(!this.aPreparedThumbs.length){this.aPreparedThumbs=eval(this.sPreparedThumbs);this.aPreparedThumbs=this.aPreparedThumbs[this.sID];}
if(!this.aImages.length)
this.loadImages();var obj=this;this.oHolder.mouseenter(function(){obj.start();});this.oHolder.mouseleave(function(){obj.stop();});};this.loadImages=function(){var iCount,iNumber,oImage;var iLoadedImages=0;var iAllowedToLoad=16;if(!this.aImages.length)
iAllowedToLoad=2;this.aImages=new Array();for(iCount=0;iCount<this.aPreparedThumbs.length;iCount++){if(this.aPreparedThumbs[iCount]==1){iNumber=("00"+(iCount+1)).slice(-3);oImage=new Image();oImage.src=this.prepareUrl(iNumber);this.aImages.push(oImage);iLoadedImages++;}
if(iAllowedToLoad==iLoadedImages){return;}}};this.start=function(){if(this.oHolder.hasClass('skip')){this.skip=true;return false;}
this.loadImages();$('#'+this.sID).parent().append('<span id="'+this.sContainer+'"></span>');var obj=this;$('#'+this.sContainer).click(function(){window.location=obj.oHolder.attr('href');});var iImages=this.aImages.length;for(var i=0;i<iImages;i++){$('#'+this.sContainer).append(this.aImages[i]);}
this.oHolder.attr('title','');var iShowImg=this.iShowImg;var iLeft=this.iLeft;var sContainer=this.sContainer;this.oInterval=setInterval(function(){if(iShowImg>=iImages-1){iShowImg=0;}else{iShowImg++;}
$('#'+sContainer).css({'left':-1*iLeft*iShowImg+'px','display':'block'});},this.iSpeed);};this.stop=function(){this.showImg=0;clearInterval(this.oInterval);this.oHolder.attr('title',this.sTitle);$('#'+this.sID).parent().find('#'+this.sContainer).remove();if(!this.skip){$('#'+this.sID).css('border',this.sBorderOut);}};this.prepareUrl=function(iImageNumber){if(!this.sFolder)
this.sFolder=("0000000"+Math.floor(this.sID/1000)+'').slice(-7)+'/'+this.sID;return this.sThumbsServer+this.sFolder+'/'+this.sID+'_'+iImageNumber+this.sImgSize+'.jpg';};}
function thumb_action(id,cmd,priv){var opacity=document.getElementById('xop_'+id);var confirm=document.getElementById('xconf_'+id);var button=document.getElementById('but_'+id);var div_button=document.getElementById('xbut_'+id);if(priv!=null&&priv==1){var priv_tag=document.getElementById('xpriv_'+id);}else if(priv==2){var msg_tag=document.getElementById('xmsg_'+id);}
switch(cmd){case'over':div_button.style.display='block';if(priv!=null&&priv==1)priv_tag.style.display='block';break;case'out':div_button.style.display='none';if(priv!=null&&priv==1)priv_tag.style.display='none';break;case'delete':if(priv!=2)opacity.style.display='block';confirm.style.display='block';button.style.display='none';$('#smf_'+id).hide();if(priv==2)msg_tag.style.display='none';break;case'reject':if(priv!=2)opacity.style.display='none';confirm.style.display='none';button.style.display='block';$('#smf_'+id).show();if(priv==2)msg_tag.style.display='block';break;}}
function customSelects(group){var selectedButton="";var buttonsGroup=document.getElementsByName(group);var numButtons=buttonsGroup.length;for(var i=0;i<numButtons;i++){buttonsGroup[i].parentNode.style.backgroundPosition="0% 0%";if(buttonsGroup[i].checked){buttonsGroup[i].parentNode.style.backgroundPosition="0% 50%";}}}
function selectText(obj){obj.focus();obj.select();}
function isValidEmail(email){var re=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return email.match(re);}
function goTo(sURL){window.top.location.href=sURL;}
function reload(){window.top.location.href=window.top.location;}
function setCookie(name,value,expireDays){var oExpDate=new Date();oExpDate.setTime(oExpDate.getTime()+expireDays*24*3600*1000);document.cookie=name+'='+escape(value)+
((expireDays==null)?'':';expires='+oExpDate.toUTCString())+';path=/';}
function htmlspecialchars(string){return $('<span>').text(string).html();}
function removeURLandEmail(string){string=(string+' ').replace(/((https?|ftp)\:\/\/)?([a-z0-9+!*(),;?&=\$_.-]+(\:[a-z0-9+!*(),;?&=\$_.-]+)?@)?([a-z0-9-]+\.)+([a-z]{2,4})(\/[a-z0-9-_.]*|)/ig,'*** ');string=string.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/ig,'***');return string;}
function limitInput(id,limit){var string=$('#'+id).val();if(string.length>limit){string=string.substr(0,limit);$('#'+id).val(string);}}
function _staticModeNoAction(){return false;}
function _staticModeMessage(){displayFunctionalityError('#missingFunctionality');$("html").scrollTop(0);return false;}
function displayFunctionalityError(holder){$holder=$(holder);$holder.append('<div id="accDisabledMsgHolder"><div class="bottom"><div id="accDisabledMsg"><h2>This functionality is temporarily unavailable</h2><p>Please try again later</p><div class="noPadding"><a id="btnClosePoll" href="javascript:;" class="reactivateAccount" onclick="closePoll(\''+holder+'\')">CLOSE</a></div></div></div></div>');$holder.show();}
function closePoll(holder){$holder=$(holder);$holder.html('');$holder.hide();}
function GlobalSettings(){this.settings={device:"Unknown"};this.set=function(setting,value){if(typeof setting!="string")
return;if(typeof this.settings[setting]=="undefined")
return;if(typeof value=="string"&&value.length<=0)
return;this.settings[setting]=value;}
this.get=function(setting){if(typeof this.settings[setting]=="undefined")
throw new Exception("No such setting: "+setting);return this.settings[setting];}
this.isAndroidDevice=function(){switch(this.settings.device){case"MotorolaXoom":case"KindleFire":case"DellStreak":case"SamsungGalaxyTab":return true;break;}
return false;}}
function styleCheckBox(options){var checkBox=$('#'+options.element);checkBox.wrap('<span class="'+options.container+'" />');var customCheckBoxHolder=checkBox.parent();if(options.label!=''){customCheckBoxHolder.append('<label for="'+options.element+'">'+options.label+'</label>');}
customCheckBoxHolder.append('<span />');checkBox.change(options,function(options){drawStyledCheckBox(customCheckBoxHolder);});customCheckBoxHolder.children('span').click(function(){checkBox.prop('checked',!checkBox.prop('checked'));drawStyledCheckBox(customCheckBoxHolder);});}
function drawStyledCheckBox(holder){var checkBox=holder.children('input');if(checkBox&&checkBox.prop('checked')){holder.children('span').addClass('checked');}else{holder.children('span').removeClass('checked');}}
function drawStyledCheckBox1($input){var $overlay=$input.data('overlay');var options=$input.data('options');if($input.prop('checked')){if(options.onClass==''){$overlay.removeClass(options.offClass);}else{$overlay.addClass(options.onClass);}}else{if(options.offClass==''){$overlay.removeClass(options.onClass);}else{$overlay.addClass(options.offClass);}}}
function styleCheckBox1(options){if(typeof(options.input)=='object'){var $input=options.input;}else{var $input=$('#'+options.input);}
if(typeof(options.onClass)=='undefined'){options.onClass='checked';}
if(typeof(options.offClass)=='undefined'){options.offClass='';}
$input.wrap('<span class="customCheck" />');var $wrapper=$input.parent();$wrapper.append('<span />');var $overlay=$wrapper.children('span');$input.data('options',options);$input.data('overlay',$overlay);drawStyledCheckBox1($input);$input.change(function(){drawStyledCheckBox1($input);});$wrapper.children('span').click(function(){$input.prop('checked',!$input.prop('checked'));drawStyledCheckBox1($input);});}
function openMail(sEmail,sSubject,sBody){var mailto_link='mailto:'+sEmail+'?subject='+sSubject+'&body='+sBody;window.location=mailto_link;return false;}
Number.prototype.formatMoney=function(c,d,t){var n=this,c=isNaN(c=Math.abs(c))?2:c,d=d==undefined?",":d,t=t==undefined?".":t,s=n<0?"-":"",i=parseInt(n=Math.abs(+n||0).toFixed(c))+"",j=(j=i.length)>3?j%3:0;return s+(j?i.substr(0,j)+t:"")+i.substr(j).replace(/(\d{3})(?=\d)/g,"$1"+t)+(c?d+Math.abs(n-i).toFixed(c).slice(2):"");};function deleteLayer(sElement,bShow){var oConfirmation=$('#'+sElement+' .confirm-delete');var oX=$('#'+sElement+' .btnDelete');if(bShow){oConfirmation.addClass('show');oX.addClass('hide');}else{oConfirmation.removeClass('show');oX.removeClass('hide');}}
function showInfoTooltip(attachMouseOut,relativeTo,message){var top=$(relativeTo).offset().top-76;var left=$(relativeTo).offset().left;var div1=document.createElement('div');div1.className='infoBlockExport';div1.style.top=top+'px';var div2=document.createElement('div');div2.className='infoBlockLeft';var div3=document.createElement('div');div3.className='infoBlockRepeat';var img1=document.createElement('img');img1.src='http://img01.redtubefiles.com/_thumbs/design/affiliate/infoBlockExportArrow.png';img1.width=16;img1.height=9;div1.appendChild(div2);div2.appendChild(div3);div3.appendChild(img1);div3.appendChild(document.createTextNode(message));document.body.appendChild(div1);div1.style.left=left-Math.floor($(div1).outerWidth(true)/2)+'px';attachMouseOut.onmouseout=function(e){document.body.removeChild(div1);}}
function changeCheckbox(id){var chbHolder=document.getElementById('op'+id);var chb=document.getElementById('chb'+id);if(chb.checked==true){chbHolder.style.backgroundPosition='0% 100%';}
if(chb.checked==false){chbHolder.style.backgroundPosition='0% 0%';}}
var atmtTime=new Date();var atmtPx=0;var atmtMtime=0;var atmtX=0;var atmtY=0;var _x;var _y;var isIE=document.all?true:false;if(!isIE)document.captureEvents(Event.MOUSEMOVE);document.onmousemove=getMousePosition;function getMousePosition(mp){if(!isIE){_x=mp.pageX;_y=mp.pageY;}
if(isIE){_x=event.clientX+document.body.scrollLeft;_y=event.clientY+document.body.scrollTop;}
atmtPx+=1;return true;}
function atmtMTrack(){if(_x!=atmtX||_y!=atmtY){atmtMtime+=1;atmtX=_x;atmtY=_y;}}
setInterval(atmtMTrack,100);window.onbeforeunload=function(){var endTime=new Date();var atmtSpent=(endTime-atmtTime);var atmtMSpent=((atmtMtime*100)/1000);setCookie('atmt',Math.round(atmtSpent/1000)+';'+Math.round(atmtMSpent)+';'+atmtPx);}