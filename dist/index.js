/*
    A plugin for adding media content to TinyMCE 5
    Copyright Flexnet/Wegeberg 2019-2022
    https://www.flexnet.dk
    Free to use if you include this comment.
*/

// Enter appID and clientToken from your Facebook app
// You MUST set the id of the script-tag to: flexnet-tinymce5-some
const appID       = "XXX";
const clientToken = "XXX";

// If true the resulting HTML code will be used 
// for making a preview in the #preview div
const someShowPreview = false;

let flexnetError = null;

if (appID.substring(0, 3) === 'XXX') {
    flexnetError = "You have to enter your Facebook appID and clientToken in flexnet-some.js";
}
const flexnetScriptTag = $("script#flexnet-tinymce5-some");
if (typeof flexnetScriptTag === "undefined") {
    flexnetError = "The script tag for flexnet-tinymce5-some plugin MUST have the id flexnet-tinymce5-some";
}

if (flexnetError) {
    alert(flexnetError);
    // return;
}

const scriptSrc = flexnetScriptTag.attr('src').split('?')[0]; // find folder of this script
const scriptDir = scriptSrc.split('/').slice(0, -2).join('/') + '/'; // remove 'dist/index.js'
const apiUrl = `${scriptDir}api/`;

const some_icon = `<svg width="24px" height="24px" viewBox="0 0 209 240" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="SO-ME" transform="translate(0.520000, 0.760000)" fill="#000000" fill-rule="nonzero">
        <path d="M94.08,80.8 C94.08,36.8 21.6,57.28 21.6,31.2 C21.6,20.48 31.04,15.68 44.64,15.68 C60.64,15.68 69.28,22.08 70.56,34.08 C70.72,34.88 71.36,35.36 72,35.36 L89.92,35.36 C90.56,35.36 91.2,34.72 91.04,34.08 C88.16,10.56 71.2,0 45.28,0 C18.56,0 2.24,12.48 2.24,33.12 C2.24,76.96 74.56,55.84 74.56,83.52 C74.56,96 64.64,100.96 49.12,100.96 C28.96,100.96 21.92,91.84 20.64,77.44 C20.48,76.8 19.84,76.16 19.2,76.16 L1.28,76.16 C0.64,76.16 0,76.8 0,77.44 C1.12,103.68 19.68,116.48 48.64,116.48 C76,116.48 94.08,104.16 94.08,80.8 Z" id="Path"></path>
        <path d="M208.32,58.56 C208.32,22.4 186.4,0 153.28,0 C119.84,0 98.24,22.72 98.24,58.4 C98.24,92.96 120,116.48 153.28,116.48 C186.4,116.48 208.32,93.12 208.32,58.56 Z M118.56,58.56 C118.56,31.84 131.04,15.84 153.28,15.84 C175.36,15.84 188.16,32.32 188.16,58.56 C188.16,84.8 175.36,100.64 153.28,100.64 C131.36,100.64 118.56,84.64 118.56,58.56 Z" id="Shape"></path>
        <path d="M22.16,164.04 L21.84,152.04 L54.8,238.12 C55.12,238.76 55.76,239.24 56.56,239.24 L69.52,239.24 C70.32,239.24 70.96,238.76 71.28,237.96 L102.16,154.6 L102,163.72 L101.52,190.6 L101.36,237.96 C101.36,238.6 102,239.24 102.64,239.24 L119.92,239.24 C120.56,239.24 121.2,238.6 121.2,237.96 L120.56,183.72 L121.04,128.52 C121.04,127.88 120.4,127.24 119.76,127.24 L97.68,127.24 C96.88,127.24 96.24,127.72 95.92,128.52 L64.4,214.6 L31.6,128.36 C31.28,127.72 30.64,127.24 29.84,127.24 L6.16,127.24 C5.52,127.24 4.88,127.88 4.88,128.52 L5.36,183.72 L4.88,237.96 C4.88,238.6 5.52,239.24 6.16,239.24 L21.52,239.24 C22.16,239.24 22.8,238.6 22.8,237.96 L22.64,190.6 L22.16,164.04 Z" id="Path"></path>
        <path d="M205.68,239.24 C206.32,239.24 206.96,238.6 206.96,237.96 L206.96,225.16 C206.96,224.52 206.32,223.88 205.68,223.88 L151.12,223.88 L150.64,187.56 L200.08,187.56 C200.72,187.56 201.36,186.92 201.36,186.28 L201.36,173.48 C201.36,172.84 200.72,172.2 200.08,172.2 L150.64,172.2 L151.12,142.6 L204.4,142.6 C205.04,142.6 205.68,141.96 205.68,141.32 L205.68,128.52 C205.68,127.88 205.04,127.24 204.4,127.24 L132.56,127.24 C131.92,127.24 131.28,127.88 131.28,128.52 L131.92,182.44 L131.28,237.96 C131.28,238.6 131.92,239.24 132.56,239.24 L205.68,239.24 Z" id="Path"></path>
    </g>
</g>
</svg>`;

const getFacebook = facebookUrl => {
    const url = `https://graph.facebook.com/v12.0/oembed_post?url=${encodeURIComponent(facebookUrl)}&access_token=${appID}|${clientToken}`;
    $.ajax({
        url: url,
        dataType: "jsonp",
        async: false,
        success: function(data) {
            if (someShowPreview) {
                $("#preview").html(data.html);
            }
            if (data.html) {
                tinyMCE.activeEditor.insertContent(
                    data.html
                );
            } else {
                console.error ("No HTML returned");
                console.error (url);
            }
        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        },
    });
};

const getInstagram = instagramUrl => {
    const url = `https://graph.facebook.com/v12.0/instagram_oembed?url=${encodeURIComponent(instagramUrl)}&access_token=${appID}|${clientToken}`;
    $.ajax({
        url: url,
        dataType: "jsonp",
        async: false,
        success: function(data) {
            if (someShowPreview) {
                $("#preview").html(data.html);
            }
            if (data.html) {
                tinyMCE.activeEditor.insertContent(
                    data.html
                );
            } else {
                console.error ("No HTML returned");
                console.error (url);
            }
        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        },
    });
};

const doInsert = api => {
    const apiData = api.getData();
    const embedUrl = apiData.url;
    if (embedUrl.indexOf ("facebook") > 0 || embedUrl.indexOf("https://fb.") === 0) {
        getFacebook(embedUrl);
    } else if (embedUrl.indexOf("instagram") > 0) {
        getInstagram(embedUrl);
    } else {
        const url = `${apiUrl}?url=${embedUrl}`;
        $.getJSON(url)
            .done(data => {
                if (someShowPreview) $("#preview").html(data.html);
                tinyMCE.activeEditor.insertContent(data.html);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log (errorThrown);
                console.log (embedUrl);
                alert('getJSON request failed! ' + textStatus);
            });
            // .fail(() => alert(`getJSON error: ${url}`));
    }
};

tinymce.PluginManager.add('flexnet_some', function(editor, url) {
    editor.ui.registry.addIcon('some_icon', some_icon);
    editor.on('init', function (args) {
        editor_id = args.target.id;
    });
    editor.ui.registry.addButton('flexnet_some', {
        icon: 'some_icon',
        tooltip: 'Insert Tweet, Facebook post, YouTube, Soundcloud, Infogram, Instagram',
        onAction: function () {
            editor.windowManager.open({
                title: 'Flexnet SOME embed',
                size: 'normal',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'input',
                            name: 'url',
                            placeholder: 'Enter URL',
                            inputMode: 'text'
                        }
                    ]
                },
                buttons: [
                    {
                        type: 'custom',
                        name: 'indsaet',
                        text: 'Indsæt',
                        primary: true
                    },            
                ],
                onAction: function (api) {
                    doInsert(api);
                    editor.windowManager.close();
                }
            });
        }
    });
});
