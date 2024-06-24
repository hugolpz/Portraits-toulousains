// PURPOSE: Script to upload targets using an external data file.
// Run: $node wiki-upload-many.js
const Wikiapi= require('wikiapi');
const logins = require('./logins.js');
const portraits = require('./data/portraits.js');  // <----------------- data from there

// Login credentials from .login*.js
var USER = logins.commons.user,
	PASS = logins.commons.pass,
	API  = logins.commons.api;

var tpl = function(portrait){ 
    return `{{${tplTitle}
 |person             = ${portrait["person"]}
 |person-qid         = ${portrait["person-qid"]}
 |person-ark         = ${portrait["person-ark"]}
 |idref              = ${portrait["idref"]}
 |artwork-title      = ${portrait["artwork-title"]}
 |artwork-description= ${portrait["artwork-description"]}
 |source-date        = ${portrait["source-date"]}
 |artwork-author     = ${portrait["artwork-author"]}
 |artwork-author-ark = ${portrait["artwork-author-ark"]}
 |artwork-author-idref=${portrait["artwork-author-idref"]}
 |file-author        = ${portrait["file-author"]}
 |source-reference   = ${portrait["source-reference"]}
 |source-link        = ${portrait["source-link"]}
 |source-storage     = ${portrait["source-storage"]}
 |licence            = ${portrait["licence"]}
 |person-era         = ${portrait["person-era"]}
 |person-localisation= ${portrait["person-localisation"]}
 |person-activity    = ${portrait["person-activity"]}
 |topic-1            = ${portrait["topic-1"]}
 |topic-2            = ${portrait["topic-2"]}
 |filename           = ${portrait["filename"]}
}}`
}

(async () => {
    // Connect
    const wiki = new Wikiapi;
    await wiki.login(USER, PASS, API);
    console.log(`Username ${USER.split('@')[0]} is connected !`);

/* *************************************************************** */
/* CORE ACTION(S) HERE : HACK ME ! ******************************* */
    // Set upload parameters, maily for licensing reasons.
    // Note: parameter `text`, filled with the right wikicode `{{description|}}`, can replace most parameters.
    let options = {
        author: `[[User:${USER.split('@')[0]}|]]`,
        date: new Date().toISOString().split('T')[0],
        //source_url: 'https://github.com/kanasimi/wikiapi',
        permission: '{{own}}',
        other_versions: '',
        other_fields: '',
        license: ['{{self|PD|cc-by-sa-4.0}}' ],
        //categories: [`[[Category:WikiVoc]]`, `[[Category:${USER.split('@')[0]} test: upload]]` ],
        bot: 1,
        ignorewarnings: 1,  // overwrite
       // tags:"tag1|tag2",
    };
    console.log(portraits[0])
    for(i=0;i<portraits.length;i++){
        console.log(portraits[i].filename)
        // Upload file from URL
        var tplTitle="Rosalis"; // Tolosana
        var portrait = portraits[i];
 
        try{
            wiki.upload({
                file_path: `../img/${portrait.filename}`,
                filename: `${portrait["artwork-title"]}.jpg`,  // default : keep filename
                comment: `Upload archive illustration for ${portrait.person}.`,
                ...options,
                text: tpl(portrait),
                description: `${portrait.description}.`
            });
        }catch(e){ console.error('Fails upload: '+ e); }
    }
/* END CORE ****************************************************** */
/* *************************************************************** */

})();
