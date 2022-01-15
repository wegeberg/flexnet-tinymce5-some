/*
    A plugin for adding media content to TinyMCE 5
    Copyright Flexnet/Wegeberg 2019-2021
    https://www.flexnet.dk
    Free to use if you include this comment.
*/

const appID         = "1378389398979888";
const clientToken   = "a29c14ff3637395281f955093052869d";
const apiUrl        = "/api/flexnet-some-embed.php";

const some = `<svg width="24px" height="24px" viewBox="0 0 209 240" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="SO-ME" transform="translate(0.520000, 0.760000)" fill="#000000" fill-rule="nonzero">
        <path d="M94.08,80.8 C94.08,36.8 21.6,57.28 21.6,31.2 C21.6,20.48 31.04,15.68 44.64,15.68 C60.64,15.68 69.28,22.08 70.56,34.08 C70.72,34.88 71.36,35.36 72,35.36 L89.92,35.36 C90.56,35.36 91.2,34.72 91.04,34.08 C88.16,10.56 71.2,0 45.28,0 C18.56,0 2.24,12.48 2.24,33.12 C2.24,76.96 74.56,55.84 74.56,83.52 C74.56,96 64.64,100.96 49.12,100.96 C28.96,100.96 21.92,91.84 20.64,77.44 C20.48,76.8 19.84,76.16 19.2,76.16 L1.28,76.16 C0.64,76.16 0,76.8 0,77.44 C1.12,103.68 19.68,116.48 48.64,116.48 C76,116.48 94.08,104.16 94.08,80.8 Z" id="Path"></path>
        <path d="M208.32,58.56 C208.32,22.4 186.4,0 153.28,0 C119.84,0 98.24,22.72 98.24,58.4 C98.24,92.96 120,116.48 153.28,116.48 C186.4,116.48 208.32,93.12 208.32,58.56 Z M118.56,58.56 C118.56,31.84 131.04,15.84 153.28,15.84 C175.36,15.84 188.16,32.32 188.16,58.56 C188.16,84.8 175.36,100.64 153.28,100.64 C131.36,100.64 118.56,84.64 118.56,58.56 Z" id="Shape"></path>
        <path d="M22.16,164.04 L21.84,152.04 L54.8,238.12 C55.12,238.76 55.76,239.24 56.56,239.24 L69.52,239.24 C70.32,239.24 70.96,238.76 71.28,237.96 L102.16,154.6 L102,163.72 L101.52,190.6 L101.36,237.96 C101.36,238.6 102,239.24 102.64,239.24 L119.92,239.24 C120.56,239.24 121.2,238.6 121.2,237.96 L120.56,183.72 L121.04,128.52 C121.04,127.88 120.4,127.24 119.76,127.24 L97.68,127.24 C96.88,127.24 96.24,127.72 95.92,128.52 L64.4,214.6 L31.6,128.36 C31.28,127.72 30.64,127.24 29.84,127.24 L6.16,127.24 C5.52,127.24 4.88,127.88 4.88,128.52 L5.36,183.72 L4.88,237.96 C4.88,238.6 5.52,239.24 6.16,239.24 L21.52,239.24 C22.16,239.24 22.8,238.6 22.8,237.96 L22.64,190.6 L22.16,164.04 Z" id="Path"></path>
        <path d="M205.68,239.24 C206.32,239.24 206.96,238.6 206.96,237.96 L206.96,225.16 C206.96,224.52 206.32,223.88 205.68,223.88 L151.12,223.88 L150.64,187.56 L200.08,187.56 C200.72,187.56 201.36,186.92 201.36,186.28 L201.36,173.48 C201.36,172.84 200.72,172.2 200.08,172.2 L150.64,172.2 L151.12,142.6 L204.4,142.6 C205.04,142.6 205.68,141.96 205.68,141.32 L205.68,128.52 C205.68,127.88 205.04,127.24 204.4,127.24 L132.56,127.24 C131.92,127.24 131.28,127.88 131.28,128.52 L131.92,182.44 L131.28,237.96 C131.28,238.6 131.92,239.24 132.56,239.24 L205.68,239.24 Z" id="Path"></path>
    </g>
</g>
</svg>`;

function getFacebook(facebookUrl) {
    const url = `https://graph.facebook.com/v12.0/oembed_post?url=${encodeURI(facebookUrl)}&access_token=${appID}|${clientToken}`;
    $.ajax({
        url: url,
        dataType: "jsonp",
        async: false,
        success: function(data) {
            console.log("FB data", data);
            // $("#embedCode").val(data.html);
            // $("#preview").html(data.html)
            if (data.html) {
                tinyMCE.activeEditor.insertContent(
                    data.html
                );
            } else {
                console.log("UPS - ingen html returneret");
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
}

const doInsert = function(api) {
    const apiData = api.getData();
    const embedUrl = apiData.url;
    if(embedUrl.indexOf("facebook") > 0) {
        // console.log("Det er Facebook");
        getFacebook(embedUrl);
    } else {
        // console.log("Det er IKKE Facebook");
        const url = `${apiUrl}?url=${embedUrl}`;
        $.getJSON(url, function(data, status) {
            if(data.success) {
                // $("#preview").html(data.result.html);
                console.log(data);
                tinyMCE.activeEditor.insertContent(
                    data.result.html
                );
            } else {
                console.log(data.debug);
                alert("Returned error: " + data.error);
            }
        })
        .fail(function() {
            console.log( "getJSON error:", url );
        });
    }
}

tinymce.PluginManager.add('flexnet_some', function(editor, url) {
    editor.ui.registry.addIcon('some', some);
    editor.on('init', function (args) {
        editor_id = args.target.id;
    });
    editor.ui.registry.addButton('flexnet_some', {
        icon: 'some',
        tooltip: 'Indsæt Tweet, Facebook post, YouTube, Soundcloud, Infogram, Instagram',
        onAction: function () {
            editor.windowManager.open({
                title: 'Flexnet URL embed',
                size: 'normal',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'input',
                            name: 'url',
                            placeholder: 'Indtast URL',
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
                    console.log("submitted", api);
                    doInsert(api);
                    editor.windowManager.close();
                }
            });
        }
    });
});


// const flexcircle = `<svg width="24px" height="24px" viewBox="0 -40 238 238" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
// <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
//     <g id="flex" transform="translate(0.720000, 0.240000)" fill="#000000" fill-rule="nonzero">
//         <path d="M31.68,45.76 L49.92,45.76 C50.56,45.76 51.2,45.12 51.2,44.48 L51.2,32.64 C51.2,32 50.56,31.36 49.92,31.36 L31.68,31.36 L31.68,26.88 C31.68,17.6 35.52,14.4 41.44,14.4 C44.8,14.4 47.68,14.72 49.92,15.36 C50.56,15.52 51.2,15.04 51.2,14.4 L51.2,2.72 C51.2,2.08 50.56,1.28 49.92,1.28 C46.4,0.64 41.6,0 37.12,0 C24.96,0 12.8,6.72 12.8,25.12 L12.8,31.36 L1.28,31.36 C0.64,31.36 0,32 0,32.64 L0,44.48 C0,45.12 0.64,45.76 1.28,45.76 L12.8,45.76 L12.8,77.12 L12.16,112.48 C12.16,113.12 12.8,113.76 13.44,113.76 L31.04,113.76 C31.68,113.76 32.32,113.12 32.32,112.48 L31.68,77.12 L31.68,45.76 Z" id="Path"></path>
//         <path d="M75.84,113.76 C76.48,113.76 77.12,113.12 77.12,112.48 L76.64,57.44 L77.12,3.04 C77.12,2.4 76.48,1.76 75.84,1.76 L59.2,1.76 C58.56,1.76 57.92,2.4 57.92,3.04 L58.56,57.44 L57.92,112.48 C57.92,113.12 58.56,113.76 59.2,113.76 L75.84,113.76 Z" id="Path"></path>
//         <path d="M146.08,85.6 C145.44,85.6 144.64,86.08 144.48,86.88 C142.24,97.12 135.68,102.08 125.6,102.08 C111.68,102.08 104.48,93.76 103.68,76.16 L163.84,76.16 C164.48,76.16 165.12,75.52 165.12,74.88 C164.64,46.72 150.24,29.44 124.64,29.44 C99.68,29.44 84.48,46.72 84.48,72.8 C84.48,97.92 98.72,115.68 125.28,115.68 C147.36,115.68 160.96,102.72 163.2,86.88 C163.36,86.24 162.72,85.6 162.08,85.6 L146.08,85.6 Z M144.32,63.2 L104.32,63.2 C106.4,49.92 113.28,42.88 124.8,42.88 C137.44,42.88 143.52,52.48 144.32,63.2 Z" id="Shape"></path>
//         <path d="M235.68,113.76 C236.32,113.76 236.64,113.12 236.32,112.64 L211.04,71.04 L234.24,32.48 C234.56,32 234.24,31.36 233.6,31.36 L216.64,31.36 C215.84,31.36 215.04,31.84 214.72,32.48 L199.36,60.8 L183.04,32.48 C182.72,31.84 181.92,31.36 181.12,31.36 L161.92,31.36 C161.28,31.36 160.96,32 161.28,32.48 L185.44,70.24 L159.68,112.64 C159.36,113.12 159.68,113.76 160.32,113.76 L177.76,113.76 C178.56,113.76 179.36,113.28 179.68,112.64 L197.12,82.08 L214.56,112.64 C214.88,113.28 215.68,113.76 216.48,113.76 L235.68,113.76 Z" id="Path"></path>
//     </g>
// </g>
// </svg>`;
