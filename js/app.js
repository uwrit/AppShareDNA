(function() {
    var app = {
        // routes (i.e. views and their functionality) defined here
        'routes': {
            'login': {
                'rendered': function() {
                    console.log('this view is "login"');
                }
            },
			'logout': {
                'rendered': function() {
                    console.log('this view is "logout"');
			
					$('.progress').show();
					// GET FILES WHEN PAGE RENDERS
					$.post('https://sharing.iths.org/sharedna/api/' , { action: "logout", api_key: app.apiKey }, function( data ) { 						  console.log(data.message); 		}, "json");
					
					 // remove data from local storage
					 window.localStorage.setItem('user','');
					 window.localStorage.setItem('files','');
					 window.localStorage.setItem('sent','');
					 window.localStorage.setItem('emailRecipients','');
					 window.localStorage.setItem('smsRecipients','');
					 window.localStorage.setItem('fileKey','');
					
					 app.apiKey		=	'';
					 app.userHash	= 	'';
					 
				
						$('.secureHide').show();
				$('.secureShow').hide();
					
					$('.progress').hide();
						 M.toast({html: 'You have been logged out.', classes: 'green rounded'});
					window.location.hash = '#default';
						
					
					
                }
            },
            'register': {
                'rendered': function() {
                    console.log('this view is "register"');
                }
             },
            'forgot': {
                'rendered': function() {
                    console.log('this view is "forgot"');
                }
             },
			'retrieve': {
                'rendered': function() {
                    console.log('this view is "retrieve"');
					var open_key = app.getUrlParam('open_key', 'false');
					$('#retrieveKey').val(open_key.replace("#retrieve", ""));
                }
             },
			'reset': {
                'rendered': function() {
                    console.log('this view is "reset"');
					var open_key = app.getUrlParam('token', false);
					if(!open_key) {
						M.toast({html: 'Missing reset token!', classes: 'red rounded'});
					} else {
						$('#resetToken').val(open_key.replace("#token", ""));
					}
                }
             },
			'default': {
                'rendered': function() {
                    console.log('this view is "default"');
                }
             },
			'files': {
                'rendered': function() {
					$('.decode').each(function() {
						$(this).html($(this).attr('encoded').substr(0, 64));	
					});
						$('.progress').show();
					// GET FILES WHEN PAGE RENDERS
					$.post('https://sharing.iths.org/sharedna/api/' , { action: "getFiles", api_key: app.apiKey }, function( data ) {
						  console.log(data.message);
						   var files = data.results;
 				   		   window.localStorage.setItem('files',JSON.stringify(files));
						     app.updateFileTable(files);
					  }, "json")
					  .fail(function() {
						  	// IF FAIL POPULATE FROM LOCAL STORAGE
							if(window.localStorage.getItem('files')) {
						 		 var files = $.parseJSON(window.localStorage.getItem('files'));
					 		 } else {
								 var files= ''; 
							 }
							 app.updateFileTable(files);		
					});
					  	$('.progress').hide();
					
                }
             },
			'share' :  {
                'rendered': function() {
					
							 
			
				
                }
			 },
			'sent': {
                'rendered': function() {
                    console.log('this view is "Sent"');
					
					
					$('.progress').show();
					// GET FILES WHEN PAGE RENDERS
					$.post('https://sharing.iths.org/sharedna/api/' , { action: "getSent", api_key: app.apiKey }, function( data ) {
						  console.log(data.message);
						   var sent = data.results;
 				   		   window.localStorage.setItem('sent',JSON.stringify(sent));
						     app.updateSentTable(sent);
					  }, "json")
					  .fail(function() {
						  	// IF FAIL POPULATE FROM LOCAL STORAGE
							if(window.localStorage.getItem('sent')) {
						 		 var sent = $.parseJSON(window.localStorage.getItem('sent'));
					 		 } else {
								 var sent= ''; 
							 }
							 app.updateSentTable(sent);		
					});
					  	$('.progress').hide();

                }
             },
			'account': {
                'rendered': function() {
                    console.log('this view is "Account"');
                }
             },
			'download': {
                'rendered': function() {
                    console.log('this view is "Download"');
                }
             },
			'method': {
                'rendered': function() {
					// GET the file data by walking through the files and finding via the fileKey
					var fileData = [];
					if(window.localStorage.getItem('files')) {
						var files = $.parseJSON(window.localStorage.getItem('files'));
						$.each(files, function(key, value) {
							if(value['file_key'] == window.localStorage.getItem('fileKey')) {
								 fileData = value;	
							}
						});
						$('.file_name').html(fileData['file_name']);
					 } else {
						 window.location.hash = 'files';
					 }	
                }
             },
			'email': {
				  'rendered': function() {
					  if(window.localStorage.getItem('emailRecipients')) {
						   var emailRecipients = $.parseJSON(window.localStorage.getItem('emailRecipients'));
					  } else {
						   var emailRecipients = {};
					  }
					  var fileData = [];
					if(window.localStorage.getItem('files')) {
						var files = $.parseJSON(window.localStorage.getItem('files'));
						$.each(files, function(key, value) {
							if(value['file_key'] == window.localStorage.getItem('fileKey')) {
								 fileData = value;	
							}
						});
						$('.file_name').html(fileData['file_name']);
					 }
					  console.log('rendered email page');
					  app.updateEmailRecipientsTable(emailRecipients);
					  $('#open_key').val(window.localStorage.getItem('openKey'));
					  $('#file_key').val(window.localStorage.getItem('fileKey'));
					  $('#subject').val('I have some DNA information to share with you via the ShareDNA app');
					  $("textarea#message").val("I'd like to share " + fileData.file_name + " with you. I've encrypted the file using the ShareDNA app.");
				  }
			 },
			'sms': {
				'rendered': function() {
					  console.log('this view is "SMS"');
					  if(window.localStorage.getItem('smsRecipients')) {
						   var smsRecipients = $.parseJSON(window.localStorage.getItem('smsRecipients'));
					  } else {
						   var smsRecipients = '';
					  }
					  var fileData = [];
					  if(window.localStorage.getItem('files')) {
						  var files = $.parseJSON(window.localStorage.getItem('files'));
						  $.each(files, function(key, value) {
							  if(value['file_key'] == window.localStorage.getItem('fileKey')) {
								   fileData = value;	
							  }
						  });
						  $('.file_name').html(fileData['file_name']);
					   }
					  app.updateSmsRecipientsTable(smsRecipients);
					  $('#sms_open_key').val(window.localStorage.getItem('openKey'));
					  $('#sms_file_key').val(window.localStorage.getItem('fileKey'));
					  $("textarea#smsMessage").val("I'd like to share a file using the ShareDNA app.");
					  
					  // GET PHONE CONTACTS
					  		navigator.contactsPhoneNumbers.list(function(contacts) {
								var phoneContacts = [];
								console.log(contacts.length + ' contacts found');
								for(var i = 0; i < contacts.length; i++) {
								// console.log(contacts[i].id + " - " + contacts[i].displayName);
								   for(var j = 0; j < contacts[i].phoneNumbers.length; j++) {
									    	var temp = contacts[i].phoneNumbers[j];
									   if(temp.type === 'MOBILE') {
											if(contacts[i].displayName) {
												temp.displayName = contacts[i].displayName;
												var names = contacts[i].displayName.split(" ");
												temp.firstName = names[0]
												phoneContacts[i]=temp;
											}
										//  console.log("===> " + phone.type + "  " + phone.number + " (" + phone.normalizedNumber+ ")");
									   }
								   }
								}

								phoneContacts.sort(function(a, b){
									if(a.firstName < b.firstName) { return -1; }
									if(a.firstName > b.firstName) { return 1; }
									return 0;
							})
							phoneContacts.forEach(function(v){delete v.firstName;});
								
								app.updatePhoneContactsTable(phoneContacts);
								//console.log(JSON.stringify(phoneContacts));
							 }, function(error) {
								console.error(error);
							 });
					  // END
				}
			 },
			'learn': {
				'rendered': function() {
					  console.log('this view is "Learn More"');
				}
			 }
        },  
		'actions': {
            'register': {
				'success': function(data) {
					  userData = data['results'];
					  app.apiKey	=	userData['api_key'];
					  app.userHash	= 	userData['user_hash'];
					  window.localStorage.setItem('user',JSON.stringify(data['results']));
					  M.toast({html: data['message'], classes: 'green rounded'});
					  window.location.hash = '#files';
				},
				'error': function(data) {
					console.log('register error');
				}
             },
			'login': {
				'success': function(data) {
					 userData = data['results'];
 				     window.localStorage.setItem('user',JSON.stringify(data['results']));
					 M.toast({html: data['message'], classes: 'green rounded'});
					 app.apiKey		=	userData['api_key'];
					 app.userHash	= 	userData['user_hash'];
					 window.location.hash = '#files';
				},
				'error': function(data) {
					// NOTHING
					if(data['view']=='#register') {
						var temp = confirm('You are attempting to login with an email that does not exist in our system, would you like to register instead?');
						if(temp == true ){
							emailData=data['results'];
							$('#registerEmail').val(emailData['loginEmail']);
							window.location.hash = '#register';
						}
							
					}
				}
             },
			'forgotPassword': {
				'success': function(data) {
					M.toast({html: 'Forgot Password Instructions sent.', classes: 'green rounded'});
				},
				'error': function(data) {
					M.toast({html: data['message'], classes: 'red rounded'});
				}
             },
			'changePassword': {
				'success': function(data) {
					console.log(data.message);
						M.toast({html: data['message'], classes: 'green rounded'});
							 window.location.hash = '#files';
				},
				'error': function(data) {
					//console.log(data.message);
					//M.toast({html: data['message'], classes: 'red rounded'});
				}
             },
			'resetPassword': {
				'success': function(data) {
					 console.log(data.message);
					 userData = data['results'];
 				     window.localStorage.setItem('user',JSON.stringify(data['results']));
					 M.toast({html: data['message'], classes: 'green rounded'});
					 app.apiKey		=	userData['api_key'];
					 app.userHash	= 	userData['user_hash'];
					 window.location.hash = '#files';
				},
				'error': function(data) {
					console.log(data.message);
				}
             },		  
			'addFile': {
				'success': function(data) {
						var files = data['results'];
					   	window.localStorage.setItem('files',JSON.stringify(files));
						app.updateFileTable(files);
						M.toast({html: data['message'], classes: 'green rounded'});
						document.getElementById("file").value = "";
				},
				'error': function(data) {
					console.log(data['message']);
				}
             },
			'shareFile': {
				'success': function(data) {
					var    results = data['results'];
					window.localStorage.setItem('fileKey',results.check_key);
					window.localStorage.setItem('openKey',results.open_key);
					window.location.hash = 'method';
					M.toast({html: JSON.stringify(data['message']), classes: 'green rounded'});
				},
				'error': function(data) {
					console.log(data['message']);
				}
             },
			'sendEmail': {
				'success': function(data) {
					window.location.hash = 'sent';
					M.toast({html: "Email Sent", classes: 'green rounded'});
					console.log(data);
				},
				'error': function(data) {
					console.log(data['message']);
				}
             },
			'sendSMS': {
				'success': function(data) {
					var results = data.results;
					var options = {
						replaceLineBreaks: false, // true to replace \n by a new line, false by default
						android: {
							intent: 'INTENT'  // send SMS with the native android SMS messaging
							//intent: '' // send SMS without opening any other app
						}
					};
		
					console.log(results.message);
	
				window.plugins.socialsharing.shareViaSMS(results.message, results.recipientsStr, 
				function(msg) {
				console.log('ok: ' + msg);
				M.toast({html: 'Messenger activated', classes: 'green rounded'});
					window.location.hash = 'sent';
				}, 
				function(msg) {
				console.log('error: ' + msg);
				M.toast({html: 'Messenger failed to activate', classes: 'red rounded'});
			
				});

				},
				'error': function(data) {
					console.log(data.message);
				}
             },
			'downloadFile': {
				'success': function(data) {

					var results = data['results'];
					if(results.key) {
						var linkString = 'https://sharing.iths.org/sharedna/api/?action=decryptDownload&api_key=' + app.apiKey + '&key='+ results.key + '&check_key=' +results.check_key;
					  	
							if(isCordovaApp) {
									$('.progress').show();
									if (!downloader.isInitialized()) { // Not initialized?
										downloader.init({folder: "ShareDNA"});	
									} 
								    document.addEventListener('DOWNLOADER_downloadSuccess', function onDownload(event){
									event.target.removeEventListener("DOWNLOADER_downloadSuccess", onDownload, false); //remove listener
									var data = event.data;
						
									$("#downloadLink").html('');
				   					$("#downloadLink").append('<a href="javascript:void(0)" onClick="app.cordovaOpen(\''+data[0].nativeURL+'\', \''+results.file_type +'\')" class="waves-effect waves-green deep-purple btn white-text downloadLink"><i class="material-icons left white-text">cloud_download</i> ' + results.file_name + '</a>');
									 $('.progress').hide();
									window.location.hash = 'download';

								});
										
								downloader.get(linkString, null, results.file_name);	
								$('.progress').hide();	 
							} else {
									$('.progress').show();
							  // GET FILES WHEN PAGE RENDERS					
							   var xhr = new XMLHttpRequest();
								xhr.onreadystatechange = function(){
									if (this.readyState === 4 && this.status === 200){
										//this.response is what you're looking for
									}
								};
								xhr.open('GET', linkString);
								xhr.responseType = 'blob';
								xhr.send();      
								xhr.onload = function () {
								   if (this.readyState === 4 && this.status === 200){
										app.showFile(xhr.response, results);  
								   }
								};
							   $('.progress').hide();	  
							}
						
					  
					}
				},
				'error': function(data) {
					console.log(data['message']);
				}
             },
			'retrieveFile': {
				 'success': function(data) {
					M.toast({html: JSON.stringify(data['message']), classes: 'green rounded'});
					window.location.hash = 'register';
				},
				'error': function(data) {
					console.log(data['message']);
				}
			 },
			'renameFile': {
				'success': function(data) {
						var files = data['results'];
					   	window.localStorage.setItem('files',JSON.stringify(files));
						app.updateFileTable(files);
						M.toast({html: JSON.stringify(data['message']), classes: 'green rounded'});
				},
				'error': function(data) {
					console.log(data.message);
				}
             }
        },
        // The default view is recorded here. A more advanced implementation
        // might query the DOM to define it on the fly.
        'default': 'default',
        'routeChange': function() {
            app.routeID = location.hash.slice(1);
			if(app.routeID) {
			  // console.log('routing apiKey: '+ app.apiKey);
			  app.route = app.routes[app.routeID];
			  app.routeElem = document.getElementById(app.routeID);
			  if((app.routeElem.hasAttribute('secure'))&&(!app.apiKey)) {
				window.location.hash = app.default;
			  } else {
				app.route.rendered();  
			
			  }
			  
			  window.scroll(0,0);
			}
        }, 
		'action': function(data) {
			if(app.actions[data['action']]) {
			   app.actionDo = app.actions[data['action']];
			   if(data['status']=='ok') {
				  app.actionDo.success(data);
			   } else {
				  app.actionDo.error(data);
			   }
			}
        },
        // The function to start the app
        'init': function() {
			
			window.addEventListener("error", handleError, true);

			function handleError(evt) {
    if (evt.message) { // Chrome sometimes provides this
      console.log("error: "+evt.message +" at linenumber: "+evt.lineno+" of file: "+evt.filename);
	   M.toast({html: "error: "+evt.type+" from element: "+(evt.srcElement || evt.target), classes: 'red rounded'});
    } else {
      console.log("error: "+evt.type+" from element: "+(evt.srcElement || evt.target));
	  M.toast({html: "error: "+evt.type+" from element: "+(evt.srcElement || evt.target), classes: 'red rounded'});
    }
}
			
			// FORCE login on init() by clearing the current apiKey;
			var apiKey = '';
			var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
		
			
		    // SET GLOBAL DATA OBJECT 
			if(window.localStorage.getItem('user')) {
				var userData = $.parseJSON(window.localStorage.getItem('user'));
			}
				
			// SHOW HIDE LOGGED IN OUT DOM ITEMS	
			if(apiKey!=='') {
				$('.secureShow').show();
				$('.secureHide').hide();
				console.log('logged in views show');
			} else {
				$('.secureHide').show();
				$('.secureShow').hide();
				console.log('logged out views show');
			}
			
		
			// SHOW HIDE ON DEVICE OR NOT	
			if(isCordovaApp) {
				$('.deviceShow').show();
				$('.deviceHide').hide();
				//if android change status bar color
				if (cordova.platformId === 'android') {
					StatusBar.backgroundColorByHexString("#333");
				}
			} else {
				$('.deviceHide').show();
				$('.deviceShow').hide();
			
			}
			
	
			   if(isCordovaApp) {
				   if(!window.localStorage.getItem('deviceID')) {
				  		var deviceID = device.uuid;
				 		 window.localStorage.setItem('deviceID',deviceID);
				   } else {
					    var deviceID = window.localStorage.getItem('deviceID');
				   }
				} else {
				  		var deviceID = '';
				}
            window.addEventListener('hashchange', function() {
                app.routeChange();
            });

            // If there is no hash in the URL, change the URL to
            // include the default view's hash.
            if (!window.location.hash) {
                window.location.hash = app.default;
            } else {
                // Execute routeChange() for the first time
                app.routeChange();
            }
			
				// Capture all forms
			var options = { 
				// target:        '#output1',   // target element(s) to be updated with server response 
				beforeSubmit:  app.showRequest,  // pre-submit callback 
				success: app.showResponse,
				beforeSerialize: app.prepareData,
				data: {api_key: apiKey, uuid: deviceID},
				// post-submit callback 
				// other available options: 
				// url:       url         // override for form's 'action' attribute 
				// type:      type        // 'get' or 'post', override for form's 'method' attribute 
				dataType:  'json'         // 'xml', 'script', or 'json' (expected server response type) 
				// clearForm: true        // clear all form fields after successful submit 
				// resetForm: true        // reset the form after successful submit 
				// $.ajax options can be used here too, for example: 
				// timeout:   3000 
			}; 
			
			// bind form using 'ajaxForm' 
			$('.ajaxForm').ajaxForm(options); 
			
        },
		'getFiles': function() {
			
		},	
		'makeKey': function (size=64) {
			  var text = "";
			  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";			

			  for (var i = 0; i < size; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			  }
			  return text;
		},
		'addEmailRecipient': function () {
			if(window.localStorage.getItem('emailRecipients')) {
				 var emailRecipients = $.parseJSON(window.localStorage.getItem('emailRecipients'));
			} else {
				 var emailRecipients = {};
			}
			var err='';  
			if(!app.ValidateEmail($('#shareEmail').val())) {
				err='Email is invalid. ';	
			}
			if($('#relation').val()<=0) {
				err='Missing Relationship ';	
			}
			if(!err) {				
			
				emailRecipients[$('#shareEmail').val()] = $('#relation').val();
				window.localStorage.setItem('emailRecipients',JSON.stringify(emailRecipients));  
			    console.log(JSON.stringify(emailRecipients));
					document.getElementById("shareEmail").value = "";
			    app.updateEmailRecipientsTable(emailRecipients);
			
			} else {
				M.toast({html: err, classes: 'red rounded'});
			}
		},
		'addSmsRecipient': function () {
			if(window.localStorage.getItem('smsRecipients')) {
				 var smsRecipients = $.parseJSON(window.localStorage.getItem('smsRecipients'));
			} else {
				 var smsRecipients = {};
			}
			var err='';  

			if($('#sms_relation').val()<=0) {
				err='Missing Relationship ';	
			}
			if(!err) {				
			
				smsRecipients[$('#smsPhone').val()] = $('#sms_relation').val();
				window.localStorage.setItem('smsRecipients',JSON.stringify(smsRecipients));  
			    console.log(JSON.stringify(smsRecipients));
				document.getElementById("smsPhone").value = "";
			    app.updateSmsRecipientsTable(smsRecipients);
			} else {
				M.toast({html: err, classes: 'red rounded'});
			}
		}, 
		'addThisSMSRecipient': function (contact,relation) {
			if(window.localStorage.getItem('smsRecipients')) {
				 var smsRecipients = $.parseJSON(window.localStorage.getItem('smsRecipients'));
			} else {
				 var smsRecipients = {};
			}
			var err='';  

			if(relation<=0) {
				err='Missing Relationship ';	
			}
			if(!err) {				
			
				smsRecipients[contact] = relation;
				window.localStorage.setItem('smsRecipients',JSON.stringify(smsRecipients));  
			    console.log(JSON.stringify(smsRecipients));
				document.getElementById("smsPhone").value = "";
			    app.updateSmsRecipientsTable(smsRecipients);
			} else {
				M.toast({html: err, classes: 'red rounded'});
			}
		}, 
		'updateEmailRecipientsTable': function(emailRecipients) {
				$('.progress').show();
				if(window.localStorage.getItem('emailRecipients')) {
				 	var emailRecipients = $.parseJSON(window.localStorage.getItem('emailRecipients'));
                } else {
                    var emailRecipients = {};
                }
  				
				var relations = $.parseJSON('{"1":"Mother","2":"Father","3":"Sister","4":"Brother","5":"Cousin","6":"Nephew","7":"Niece","8":"Grandmother","9":"Grandfather","10":"Son","11":"Daughter","100":"Friend","200":"Other"}');
				
				// Clear table
				$("#emailRows").html('');	
				// loop through files and populate table.
				if(JSON.stringify(emailRecipients)!='{}') {
					console.log('Found email Recipients');
					$.each(emailRecipients, function(key, value) {
						if(key) {
							$("#emailRows").append('<tr><td>' + key + '<input type="hidden" name="emails[\''+ key +'\']" value="'+ value +'"</td><td>' + relations[value] + '</td><td><a  onClick="app.deleteEmail(\'' + key + '\');" href="javascript:void(0);"><i class="material-icons red-text left">delete</i></a></td></tr>');
						}
					});
					$("#sendEmailButton").show();
				} else {
					console.log('No Recipients');
					$("#emailRows").append('<tr><td colspan="3">No recipients added to list.</td></tr>');	
				    $("#sendEmailButton").hide();
				}

				$('.progress').hide();
		},
		'updatePhoneContactsTable': function(phoneContacts) {
				$('.progress').show();
				// Clear table
				$("#contactRows").html('');	
				// loop through files and populate table.
				if(phoneContacts) {
					console.log('Found Phone Recipients');
					$.each(phoneContacts, function(key, value) {
						if(value) {
							$("#contactRows").append('<tr><td>' + value.displayName + '<br><small>' + value.number + '</small><br><select id="sms_relations_' + key + '" class="no-autoinit" style="color:#333;   display:block !important;" name="sms_relation"><option style="color:#333 !important;" value="0">Choose Relation Type</option><option style="color:#333 !important;" value="1">Mother</option><option style="color:#333 !important;" value="2">Father</option><option style="color:#333 !important;" value="3">Sister</option><option style="color:#333 !important;" value="4">Brother</option><option style="color:#333 !important;" value="5">Cousin</option><option style="color:#333 !important;" value="6">Nephew</option><option style="color:#333 !important;" value="7">Neice</option><option style="color:#333 !important;" value="8">Grand Mother</option><option style="color:#333 !important;" value="9">Grand Father</option><option style="color:#333 !important;" value="10">Son</option><option style="color:#333 !important;" value="11">Daughter</option><option style="color:#333 !important;" value="100">Friend</option><option style="color:#333 !important;" value="200">Other</option></select></td><td><td><a class="btn-small deep-purple modal-close" onClick="app.addThisSMSRecipient(\'' + value.normalizedNumber + '\',document.getElementById(\'sms_relations_' + key + '\').value);" >Add</a></td></tr>');
						}
					});
					$("#sendSMSButton").show();
				} else {
					console.log('No Recipients');
					$("#contactRows").append('<tr><td colspan="2">No Contacts</td></tr>');	
					$("#sendSMSButton").hide();
				}
				$('.progress').hide();
				
		},
		'updateSmsRecipientsTable': function(smsRecipients) {
				$('.progress').show();
				var relations = $.parseJSON('{"1":"Mother","2":"Father","3":"Sister","4":"Brother","5":"Cousin","6":"Nephew","7":"Niece","8":"Grandmother","9":"Grandfather","10":"Son","11":"Daughter","100":"Friend","200":"Other"}');
				
				// Clear table
				$("#smsRows").html('');	
				// loop through files and populate table.
				if(smsRecipients) {
					$.each(smsRecipients, function(key, value) {
						if(key) {
							$("#smsRows").append('<tr><td>' + key + '<input type="hidden" name="sms[\''+ key +'\']" value="'+ value +'"</td><td>' + relations[value] + '</td><td><a  onClick="app.deleteSms(\'' + key + '\');" href="javascript:void(0);"><i class="material-icons red-text left">delete</i></a></td></tr>');
						}
					});
				} else {
					console.log('No Recipients');
					$("#smsRows").append('<tr><td colspan="3">No recipients added to list.</td></tr>');
					$("#sendEmailButton").hide();
				}
				$('.progress').hide();
		},
		'deleteSms': function(sms) {
			  if(window.localStorage.getItem('smsRecipients')) {
				   var smsRecipients = $.parseJSON(window.localStorage.getItem('smsRecipients'));
			  }
			  delete smsRecipients[sms];
			  window.localStorage.setItem('smsRecipients',JSON.stringify(smsRecipients));
			  M.toast({html: 'SMS Recipient Deleted.', classes: 'purple rounded'}); 	
			  	    app.updateSmsRecipientsTable(smsRecipients);	
		},
		'updateFileTable': function(files) {
			
				if(files) {
				//	console.log(JSON.stringify(files));
					$('.progress').show();
						   // Clear table
							$("#fileRows").html('');
							// loop through files and populate table.
							$.each(files, function(key, value) {
								if(value.file_name) {
									if(value.source === "Added") {
										$("#fileRows").append('<tr class="'+value.newfile+'"><td id="file"><i class="material-icons hide-on-small-only" style="float:left;">enhanced_encryption</i><span  class="decode" decoded="' + value.file_name + '" encoded="' + value.file_key + '">' + value.file_key + '</span><a class=" modal-trigger" href="#renameFile' + key + '"><i class="material-icons  purple-text" title="Rename File">edit</i></a><br><small>'+ value.source +': '  + value.file_born + '</small><div id="renameFile' + key + '" class="modal modal-fixed-footer"> <div class="row"><form class="ajaxForm class="col s12" method="post" action="https://sharing.iths.org/sharedna/api/"><div class="modal-content"><h4><i class="material-icons left">edit</i> Rename File</h4><p><strong>Rename:</strong> ' + value.file_name + '</p><div class="row"><div class="input-field col s12"><i class="material-icons prefix">security</i><input id="new_filename' + key + '" name="new_filename" value="' + value.file_name + '" type="text" class="validate"><label for="new_filename' + key + '" class="black-text active ">New Filename</label><span class="helper-text" data-error="incorrect password" data-success="correct password">Enter the New Filename for this file</span></div></div></div><div class="modal-footer"><button type="submit" name="action" value="renameFile" class="modal-close waves-effect waves-green deep-purple btn white-text"><i class="material-icons  left white-text">send</i> Next</button><input type="hidden" name="check_key" value="'+ value.file_key +'" /></div></div></form></div></td><td id="file" style="width:8%;"> <a class="waves-effect waves-light btn-small purple modal-trigger" href="#modal' + key + '">Download</a><div id="modal' + key + '" class="modal modal-fixed-footer"> <div class="row"><form class="ajaxForm class="col s12" method="post" action="https://sharing.iths.org/sharedna/api/"><div class="modal-content"><h4><i class="material-icons left">enhanced_encryption</i> Download File</h4><p><strong>Confirm password to download:</strong> ' + value.file_name + '</p><div class="row"><div class="input-field col s12"><i class="material-icons prefix">security</i><input id="password' + key + '" name="password" type="password" class="validate"><label for="password' + key + '" class="black-text">Password</label><span class="helper-text"  style="color:#696969">Enter the password you log into ShareDNA with.</span><blockquote>Why do we ask for your password again?<br>ShareDNA aims to keep your data so secure that we have no way to read it once encrypted.  By requiring your password in our encryption we can literally throw away the key once your files are encrypted.  </blockquote></div></div></div><div class="modal-footer"><button type="submit" name="action" value="downloadFile" class="modal-close waves-effect waves-green deep-purple btn white-text"><i class="material-icons  left white-text">send</i> Next</button><input type="hidden" name="check_key" value="'+ value.file_key +'" /></div></div></form></div></td><td id="file" style="width:8%;"><a href="#shareModal' + key + '" class="waves-effect waves-light btn-small purple modal-trigger">Share</a><div id="shareModal' + key + '" class="modal modal-fixed-footer"> <div class="row"><form class="ajaxForm class="col s12" method="post" action="https://sharing.iths.org/sharedna/api/"><div class="modal-content"><h4><i class="material-icons left" title="share file">share</i> Share File</h4><p><strong>Confirm password to share:</strong> ' + value.file_name +'</p><div class="row"><div class="input-field col s12"><i class="material-icons prefix">security</i><input id="sharePassword' + key + '" name="password" type="password" class="validate"><label for="sharePassword' + key + '" class="black-text">Password</label><span class="helper-text"  style="color:#696969">Enter the password you log into ShareDNA with.</span><blockquote>Why do we ask for your password again?<br>ShareDNA aims to keep your data so secure that we have no way to read it once encrypted.  By requiring your password in our encryption we can literally throw away the key once your files are encrypted.  </blockquote></div></div></div><div class="modal-footer"><button type="submit" name="action" value="shareFile" class="modal-close waves-effect waves-green deep-purple btn white-text"><i class="material-icons  left white-text">share</i> Next</button><input type="hidden" name="check_key" value="'+ value.file_key +'" /></div></div></form></div></td><td id="file" style="width:8%;"><a href="#files" class="waves-effect waves-light btn-small red" onClick="app.deleteFile(\''+ value.file_key +'\')">Delete</a></td></tr>');
									} else {
										$("#fileRows").append('<tr class="'+value.newfile+'"><td id="file"><i class="material-icons hide-on-small-only" style="float:left;">enhanced_encryption</i><span  class="decode" decoded="' + value.file_name + '" encoded="' + value.file_key + '">' + value.file_key + '</span><a class=" modal-trigger" href="#renameFile' + key + '"><i class="material-icons  purple-text" title="Rename File">edit</i></a><br><small>'+ value.source +': '  + value.file_born + '</small><div id="renameFile' + key + '" class="modal modal-fixed-footer"> <div class="row"><form class="ajaxForm class="col s12" method="post" action="https://sharing.iths.org/sharedna/api/"><div class="modal-content"><h4><i class="material-icons left">edit</i> Rename File</h4><p><strong>Rename:</strong> ' + value.file_name + '</p><div class="row"><div class="input-field col s12"><i class="material-icons prefix">security</i><input id="new_filename' + key + '" name="new_filename" value="' + value.file_name + '" type="text" class="validate"><label for="new_filename' + key + '" class="black-text active ">New Filename</label><span class="helper-text" data-error="incorrect password" data-success="correct password">Enter the New Filename for this file</span></div></div></div><div class="modal-footer"><button type="submit" name="action" value="renameFile" class="modal-close waves-effect waves-green deep-purple btn white-text"><i class="material-icons  left white-text">send</i> Next</button><input type="hidden" name="check_key" value="'+ value.file_key +'" /></div></div></form></div></td><td id="file" style="width:8%;"> <a class="waves-effect waves-light btn-small purple modal-trigger" href="#modal' + key + '">Download</a><div id="modal' + key + '" class="modal modal-fixed-footer"> <div class="row"><form class="ajaxForm class="col s12" method="post" action="https://sharing.iths.org/sharedna/api/"><div class="modal-content"><h4><i class="material-icons left">enhanced_encryption</i> Download File</h4><p><strong>Confirm password to download:</strong> ' + value.file_name + '</p><div class="row"><div class="input-field col s12"><i class="material-icons prefix">security</i><input id="password' + key + '" name="password" type="password" class="validate"><label for="password' + key + '" class="black-text">Password</label><span class="helper-text" data-error="incorrect password" data-success="correct password" style="color:#696969">Enter the password you log into ShareDNA with.</span></div></div></div><div class="modal-footer"><button type="submit" name="action" value="downloadFile" class="modal-close waves-effect waves-green deep-purple btn white-text"><i class="material-icons  left white-text">send</i> Next</button><input type="hidden" name="check_key" value="'+ value.file_key +'" /></div></div></form></div></td><td id="file" style="width:8%;"><a href="#shareModal' + key + '" class="waves-effect waves-light btn-small purple modal-trigger">Share</a><div id="shareModal' + key + '" class="modal modal-fixed-footer"> <div class="row"><form class="ajaxForm class="col s12" method="post" action="https://sharing.iths.org/sharedna/api/"><div class="modal-content"><h4><i class="material-icons left" title="share file">share</i> Share File</h4><p><strong>Confirm password to share:</strong> ' + value.file_name +'</p><div class="row"><div class="input-field col s12"><i class="material-icons prefix">security</i><input id="sharePassword' + key + '" name="password" type="password" class="validate"><label for="sharePassword' + key + '" class="black-text">Password</label><span class="helper-text" data-error="incorrect password" data-success="correct password" style="color:#696969">Enter the password you log into ShareDNA with.</span></div></div></div><div class="modal-footer"><button type="submit" name="action" value="shareFile" class="modal-close waves-effect waves-green deep-purple btn white-text"><i class="material-icons  left white-text">share</i> Next</button><input type="hidden" name="check_key" value="'+ value.file_key +'" /></div></div></form></div> </td><td id="file" style="width:8%;"><a href="#files" class="waves-effect waves-light btn-small red" onClick="app.deleteFile(\''+ value.file_key +'\')">Delete</a></td><td id="file" style="width:8%;"><a href="#infoModal" class="waves-effect waves-light btn-small purple modal-trigger">testing</a><div id="infoModal" class="modal modal-fixed-footer"><div class="modal-content"><h4><i class="material-icons left" title="get tested">insert_chart</i>Getting Tested</h4><p>Your family member has shared this test result with you because it may be important for you and your family’s health.<br><br><b>What you can do</b><br></p><ol><li>Talk to your family member to learn more about their genetic test results.</li><li>Take this test result to your doctor so you can talk about if genetic testing is right for you. Your doctor can also connect you to a genetic counselor who is an expert in conditions that are passed from parents to children.</li><li>Find a genetic counselor near you by going to the National Society of Genetic Counselors website here: <a href="https://www.nsgc.org/findageneticcounselor">https://www.nsgc.org/findageneticcounselor</a></li></ol></div><div class="modal-footer"><button href="#files" class="modal-close waves-effect waves-green deep-purple btn white-text">Close</button></div></div></td></tr>');	
									}
								}
							});
							$('.modal').modal();
							$('.ajaxForm').ajaxForm(options);
							$('.decode').each(function() {
								
							$(this).html($(this).attr('encoded').substr(0, 64));	
								
							var container = $(this).get(0);
							var textToWrite = $(this).attr('decoded');

							if($(this).attr('decoded')=== $(this).html()) {
							  return 0;	
							}
							
							var i = 0;
							var progress = 0;
							var codingChars = $(this).html();
							
							function animate() {
							  setTimeout(function(){ 
								i++;
								var currentText = textToWrite.substr(0, i);
								currentText += getRandomChars(textToWrite.length - i);
							
							
								container.innerHTML = currentText;
								progress = i/textToWrite.length;
							  
								if(progress < 1) {
								  animate()
								}
							  }, 25);
							}
							
							function getRandomChars(howMany) {
							  var result = '';
							  
							  for(var i=0; i<howMany; i++) {
								if(i % 5 == 0) {
								  result += ' '
								} else {
								  result += codingChars.charAt(Math.floor(Math.random() * codingChars.length));
								}
							  }
							  return result
							}
							
							animate();	
										
						});
						$('.progress').hide();
				} else {
					$("#fileRows").html('');
					$("#fileRows").append('<tr><td colspan="4">There are no files.</td></tr>');
				}	
		},
		'updateSentTable': function(sent) {
			
				if(sent) {
				//	console.log(JSON.stringify(sent));
					$('.progress').show();
						   // Clear table
							$("#sentRows").html('');
							// loop through files and populate table.
							$.each(sent, function(key, value) {
								if(value.file_name) {
							 		$("#sentRows").append('<tr><td><i class="material-icons hide-on-small-only" style="float:left;">enhanced_encryption</i><span>' + value.file_name + '</span></td><td >' + value.relation + ' </td><td  >' + value.message_born + ' </td><td class="hide-on-small-only" >' + value.message_received + ' </td></tr>');
								}
							});
				

						$('.progress').hide();
				} else {
					$("#fileRows").html('');
					$("#fileRows").append('<tr><td colspan="4">There are no files.</td></tr>');
				}	
		},
		'showRequest': function showRequest(formData, jqForm, options) { 
			// formData is an array; here we use $.param to convert it to a string to display it 
			// but the form plugin does this for you automatically when it submits the data 
			var queryString = $.param(formData);
			//	console.log(queryString);
			return true; 
		},
		'prepareData': function prepareData(arr, $form, options) { 
			// The array of form data takes the following form: 
			// [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ] 
			$('.progress').show();
			//	console.log('api_key: ' + app.apiKey);
			// CHECK TO SEE IF SERVICE IS ALIVE, this also makes sure a cookie can be found server side if exists for the next request. 
			$.post('https://sharing.iths.org/sharedna/api/' , { action: "alive" }, function( data ) {
			//	console.log(data.status);	 
			}, "json")
			.fail(function() {
				M.toast({html: 'Service is currently down or you are not connected to the internet, try again later.', classes: 'red rounded'});
				  window.location.hash = 'login';
				return false;
			});
			// return false to cancel submit     
		},
		'showResponse': function showResponse(jsonData, statusText, xhr, $form)  { 
			// for normal html responses, the first argument to the success callback 
			// is the XMLHttpRequest object's responseText property 
		 
			// if the ajaxForm method was passed an Options Object with the dataType 
			// property set to 'xml' then the first argument to the success callback 
			// is the XMLHttpRequest object's responseXML property 
		 
			// if the ajaxForm method was passed an Options Object with the dataType 
			// property set to 'json' then the first argument to the success callback 
			// is the json data object returned by the server 
			var results = jsonData['results'];
			
			if(jsonData['status']=='ok') {
			
				// catch new api key
				if(results['api_key']) {
					var apiKey = results['api_key'];
					
			//		console.log('New api_key:' + apiKey);				
					options = { 
					  // target:        '#output1',   // target element(s) to be updated with server response 
					  beforeSubmit:  app.showRequest,  // pre-submit callback 
					  success: app.showResponse,
					  beforeSerialize: app.prepareData,
					  data: {api_key: apiKey, uuid: app.deviceID},
					  // post-submit callback 
					  // other available options: 
					  // url:       url         // override for form's 'action' attribute 
					  // type:      type        // 'get' or 'post', override for form's 'method' attribute 
					  dataType:  'json'         // 'xml', 'script', or 'json' (expected server response type) 
					  // clearForm: true        // clear all form fields after successful submit 
					  // resetForm: true        // reset the form after successful submit 
					  // $.ajax options can be used here too, for example: 
					  // timeout:   3000 
					};
					// SET LOGGED IN
					// SHOW HIDE LOGGED IN OUT DOM ITEMS	
					if(apiKey!='') {
						$('.secureShow').show();
						$('.secureHide').hide();
						console.log('logged in views show');
					} else {
						$('.secureHide').show();
						$('.secureShow').hide();
						console.log('logged out views show');
					}
					$('.ajaxForm').ajaxForm(options); 
				} else {
					
				}
				

			} else {
				
				
				if(jsonData['errors']) {
					if(jsonData['errors'].auth) {
					console.log(jsonData['errors'].auth);
						$('.secureHide').show();
						$('.secureShow').hide();
						console.log('logged out views show');
					  window.location.hash = 'login';
					}
				}
				
				var toastColor  = 'red rounded';
				M.toast({html: jsonData['message'], classes: toastColor});
				console.log(JSON.stringify(jsonData['errors']));
				
			}
	
			if(jsonData['action']) {
				console.log('Action: ' + jsonData['action']);
				console.log(jsonData['message']);
				app.action(jsonData);
			}
		
			$('.progress').hide();
		//  	M.toast({html: JSON.stringify(jsonData['message']), classes: toastColor});
		},
		'goToFiles': function () {
               window.location.hash = 'files';
			   $.post('https://sharing.iths.org/sharedna/api/' , { action: "goTo" }, function( data ) {
			   M.toast({html: data['message'], classes: 'green rounded'}); 
			}, "json")
			.fail(function() {
				
			});
		},
		'deleteFile': function(file_key) {
			if(confirm("Are you sure you want to delete this file?")) {				
				  $.post('https://sharing.iths.org/sharedna/api/' , { api_key: app.apiKey, action: "deleteFile", check_key: file_key }, function( data ) {
						M.toast({html: data['message'], classes: 'green rounded'}); 
						window.localStorage.setItem('files',JSON.stringify(files));
						app.updateFileTable(data['results']);
				  }, "json")
				  .fail(function() {
					  	M.toast({html: 'Not connected', classes: 'red rounded'}); 
				  });
			} else {
				M.toast({html: 'Deletion canceled.', classes: 'red rounded'}); 
			}
			
		},
		'deleteEmail': function(mail) {
			  if(window.localStorage.getItem('emailRecipients')) {
				   var emailRecipients = $.parseJSON(window.localStorage.getItem('emailRecipients'));
			  }
			  delete emailRecipients[mail];
			  window.localStorage.setItem('emailRecipients',JSON.stringify(emailRecipients));
			  M.toast({html: 'Recipient Deleted.', classes: 'purple rounded'}); 	
			  	    app.updateEmailRecipientsTable(emailRecipients);	
		},
		'shareFile': function(fileKey) {
			window.localStorage.setItem('fileKey',fileKey);
			window.location.hash = 'method';
		},		
		'shareForm': function() {
			formData	=	$('#shareForm').serialize();
			window.localStorage.setItem('formData',JSON.stringify(formData));
			window.location.hash = 'files';
		},
		'ValidateEmail': function ValidateEmail(mail) {
		 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
		  {
			return (true)
		  }
			return (false)
		},
		'getUrlParam':  function getUrlParam(parameter, defaultvalue){
			
			function getUrlVars() {
				var vars = {};
				var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
					vars[key] = value;
				});
				return vars;
			}
			
			
			var urlparameter = defaultvalue;
			if(window.location.href.indexOf(parameter) > -1){
				urlparameter = getUrlVars()[parameter];
				}
			return urlparameter;
		},
		'showFile': function showFile(blob,fileData){
					// It is necessary to create a new blob object with mime-type explicitly set
					// otherwise only Chrome works like it should
				
				/*	var newBlob = new Blob([blob], {type: fileData.file_type})
					// IE doesn't allow using a blob object directly as link href
					// instead it is necessary to use msSaveOrOpenBlob
					if (window.navigator && window.navigator.msSaveOrOpenBlob) {
					  window.navigator.msSaveOrOpenBlob(newBlob);
					  return;
					} 
					// For other browsers: 
					// Create a link pointing to the ObjectURL containing the blob.
					const data = window.URL.createObjectURL(newBlob);
					var link = document.createElement('a');
					link.href = data;
					link.download=fileData.file_name;
					link.click();
					setTimeout(function(){
					  // For Firefox it is necessary to delay revoking the ObjectURL
					  window.URL.revokeObjectURL(data);
					}, 100);
					
					
					*/
					
						var newBlob = new Blob([blob], {type: fileData.file_type})
						var url = window.URL.createObjectURL(blob);
				
					$("#downloadLink").html('');
				   $("#downloadLink").append('<a href="'+url+'" download="'+fileData['file_name']+'" class="waves-effect waves-green deep-purple btn white-text downloadLink"><i class="material-icons left white-text">cloud_download</i> ' + fileData.file_name + '</a>');

					window.location.hash = 'download';
	
			},
	    'cordovaOpen': function cordovaOpen (url,type) {
		
			cordova.plugins.fileOpener2.open(
							url, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
							type,
							{
								error : function(e) {
									//alert('Error status: ' + e.status + ' - Error message: ' + e.message);
								},
								success : function () {
									//alert('file opened successfully');
								}
							}
						);	
		
	},
	    'takePicture': function takePicture() {
		 	pictureSource=navigator.camera.PictureSourceType;
        	destinationType=navigator.camera.DestinationType;
			navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: false, destinationType: destinationType.DATA_URL, EncodingType: 0, MediaType: 0 });
		
	
		
		  
		  function onPhotoDataSuccess(imageData) {
			$('.progress').show();
			 $.post( 'https://sharing.iths.org/sharedna/api/', { action: "addImage", api_key: app.apiKey, data: imageData}, function(data) { 						data = $.parseJSON( data );
   											$('.progress').hide();
						var files = data['results'];
					   	window.localStorage.setItem('files',JSON.stringify(files));
						app.updateFileTable(files);
						
						M.toast({html: JSON.stringify(data['message']), classes: 'green rounded'});
				
 				 });
				 

		  }
		  
			
		

function onFail(message) {
    console.log('Photo Failed because: ' + message);
}
		  
		  
		  //function onFail(message) {
		  //	  alert('Failed because: ' + message);
		  //}
		  
		  
		  
	},
		'multisort': function(arr, columns, order_by) {
			  if(typeof columns == 'undefined') {
				  columns = []
				  for(x=0;x<arr[0].length;x++) {
					  columns.push(x);
				  }
			  }
	  
			  if(typeof order_by == 'undefined') {
				  order_by = []
				  for(x=0;x<arr[0].length;x++) {
					  order_by.push('ASC');
				  }
			  }
	  
			  function multisort_recursive(a,b,columns,order_by,index) {  
				  var direction = order_by[index] == 'DESC' ? 1 : 0;
	  
				  var is_numeric = !isNaN(+a[columns[index]] - +b[columns[index]]);
	  
	  
				  var x = is_numeric ? +a[columns[index]] : a[columns[index]].toLowerCase();
				  var y = is_numeric ? +b[columns[index]] : b[columns[index]].toLowerCase();

	  
				  if(x < y) {
						  return direction == 0 ? -1 : 1;
				  }
	  
				  if(x == y)  {               
					  return columns.length-1 > index ? multisort_recursive(a,b,columns,order_by,index+1) : 0;
				  }
	  
				  return direction == 0 ? 1 : -1;
			  }
	  
			  return arr.sort(function (a,b) {
				  return multisort_recursive(a,b,columns,order_by,0);
			  });
		  },
		'sortTable': function sortTable(table, n) {
				  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
				  table = document.getElementById(table);
				  switching = true;
				  // Set the sorting direction to ascending:
				  dir = "asc"; 
				  /* Make a loop that will continue until
				  no switching has been done: */
				  while (switching) {
					// Start by saying: no switching is done:
					switching = false;
					rows = table.rows;
					/* Loop through all table rows (except the
					first, which contains table headers): */
					for (i = 1; i < (rows.length - 1); i++) {
					  // Start by saying there should be no switching:
					  shouldSwitch = false;
					  /* Get the two elements you want to compare,
					  one from current row and one from the next: */
					  x = rows[i].getElementsByTagName("TD")[n];
					  y = rows[i + 1].getElementsByTagName("TD")[n];
					  /* Check if the two rows should switch place,
					  based on the direction, asc or desc: */
					  if (dir == "asc") {
						if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						  // If so, mark as a switch and break the loop:
						  shouldSwitch = true;
						  break;
						}
					  } else if (dir == "desc") {
						if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
						  // If so, mark as a switch and break the loop:
						  shouldSwitch = true;
						  break;
						}
					  }
					}
					if (shouldSwitch) {
					  /* If a switch has been marked, make the switch
					  and mark that a switch has been done: */
					  rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
					  switching = true;
					  // Each time a switch is done, increase this count by 1:
					  switchcount ++;
					} else {
					  /* If no switching has been done AND the direction is "asc",
					  set the direction to "desc" and run the while loop again. */
					  if (switchcount == 0 && dir == "asc") {
						dir = "desc";
						switching = true;
					  }
					}
				  }
				},
		'niceTrim': function truncate(string,length){
			if(!lenght) {
				var length = 18;	
			}
			 if (string.length > length) {
				return string.substring(0,length)+'...';
			 } else {
				return string;
			 }
		  }
    };
    window.app = app;
})();