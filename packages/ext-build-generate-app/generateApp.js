var fs = require('fs-extra')
//var _ = require('underscore')
var chalk = require('chalk');
var path = require('path')
//var util = require('./util.js')
err = function err(s) { return chalk.red('[ERR] ') + s }

//const help = require('./help.js')
//var debug = false

require('./XTemplate/js/Ext.js');
require('./XTemplate/js/String.js');
require('./XTemplate/js/Format.js');
require('./XTemplate/js/Template.js');
require('./XTemplate/js/XTemplateParser.js');
require('./XTemplate/js/XTemplateCompiler.js');
require('./XTemplate/js/XTemplate.js');

	// List all files in a directory in Node.js recursively in a synchronous fashion
	//https://gist.github.com/kethinov/6658166
	//const walkSync = (d) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map(f => walkSync(path.join(d, f)+'\n')) : d;
	function walkSync(dir, len, ApplicationDir, ApplicationName, Template, SdkVal, Packages) {
		var path = path || require('path');
		var fs = fs || require('fs');
		var files = fs.readdirSync(dir);
		files.forEach(function(file) {
			if (fs.statSync(path.join(dir, file)).isDirectory()) {
        console.log('file (directory): ' + file)
				var all = path.join(dir, file);console.log('all: ' + all)
        var small = all.slice(len)
//        try {
          fs.mkdirSync(ApplicationDir + '/' + small);
        // }
        // catch(e) {
        //   chalk.red('App already exists')
        //   return
        // }
				walkSync(path.join(dir, file), len, ApplicationDir, ApplicationName, Template, SdkVal, Packages);
			}
			else {
				console.log('file (file): ' + file)
				if (file.substr(file.length - 7) != 'default') { return }
				var i = 'People';//mjg
				iSmall = i.toLowerCase()
				var iCaps = iSmall[0].toUpperCase() + iSmall.substring(1)
				var viewFileName = iCaps + 'View'
				var viewNameSmall = iSmall + 'view'
				const uuidv4 = require('uuid/v4');
				var values = {
					universal: true,
					toolkit: 'modern',
					template: Template,
					frameworkIsV62: true,
					frameworkIsV65: true,
					fwIs60: false,
					themeName: 'default',
					classicTheme: "theme-triton",
					modernTheme: "theme-material",
					appName: ApplicationName,
					name: ApplicationName,
          frameworkKey: 'ext',
          sdkval: SdkVal,
          packages: Packages,
					uniqueId: uuidv4(),
//					modernTheme: "theme-material",
					viewFileName : viewFileName,
					viewName: iSmall + '.' + viewFileName,
					viewNamespaceName: ApplicationName + '.' + 'view.' + iSmall + '.' + viewFileName,
					viewBaseClass: "Ext.panel.Panel",
					viewNameSmall: viewNameSmall
				}
				var all = path.join(dir, file);console.log('all: ' + all)
				var content = fs.readFileSync(all).toString()
				if (file.substr(file.length - 11) == 'tpl.default') { 
					var tpl = new Ext.XTemplate(content)
          var t = tpl.apply(values)
          tpl = null
//					delete tpl
					var small = all.slice(len)
					var filename = small.substr(0, small.length - (11+1))
					fs.writeFileSync(ApplicationDir + '/' + filename, t);
				}
				else {
					var small = all.slice(len)
					var filename = small.substr(0, small.length - (7+1))
					var theNonTplPath = ApplicationDir + '/' + filename;console.log('theNonTplPath: ' + theNonTplPath)
					fs.createReadStream(all).pipe(fs.createWriteStream(theNonTplPath));
				}
			}
		});
	}



class generateApp {
  constructor(options) {
    var CurrWorkingDir = process.cwd()
    var NodeAppBinDir = path.resolve(__dirname)
    var TemplatesDir = '/extjs-templates' 
    var NodeAppTemplatesDir = path.join(NodeAppBinDir + '/..' + TemplatesDir) 
    
    var parms = options.parms
		if(parms[5] != undefined) {throw err('Only 3 parameters are allowed')}
		var ApplicationName = parms[2];console.log('ApplicationName: ' + ApplicationName)
		var ApplicationDir = parms[3];console.log('ApplicationDir: ' + ApplicationDir)
		var Template = options.template;console.log('Template: ' + Template)
		var Builds = options.builds;console.log('Builds: ' + Builds)
		var Sdk = options.sdk;console.log('Sdk: ' + Sdk)
		
		var Force = options.force;console.log('Force: ' + Force)
		if(Template == undefined) {throw '--template parameter is required'}
		if(Sdk == undefined) {throw '--sdk parameter is required'}
		if(ApplicationName == undefined) {throw 'Application Name parameter is empty'}
		if(ApplicationDir == undefined) {throw 'Application Directory parameter is empty'}
//		if (!fs.existsSync(Sdk)){throw Sdk + ' sdk folder does not exist'}
		var NodeAppApplicationTemplatesDir = path.join(NodeAppTemplatesDir + '/Application');console.log('NodeAppApplicationTemplatesDir: ' + NodeAppApplicationTemplatesDir)
		var TemplateDir = path.join(NodeAppApplicationTemplatesDir + '/' + Template);console.log('TemplateDir: ' + TemplateDir)
    //var TemplateDir = path.join(NodeAppBinDir + '/node_modules/@extjs/apptemplate-' + Template + '/template');console.log('TemplateDir: ' + TemplateDir)
    //var TemplateDir = o.options.templateFull

    var TemplateDir = ''
    if(Template == 'folder') {
      TemplateDir = options.templateFull
    }
    else {
      TemplateDir = path.join(NodeAppApplicationTemplatesDir + '/' + Template);console.log('TemplateDir: ' + TemplateDir)
    }
    
    if (!fs.existsSync(TemplateDir)){throw 'Template ' + Template + ' does not exist'}
    if (Force) {
      try {
        fs.removeSync(ApplicationDir)
        util.infLog(ApplicationDir + ' deleted (--force is set)')
      } catch(e) {
        if (e.code == 'EEXIST') throw e;
      }
    }

    if(ApplicationDir != './') {
      fs.mkdirSync(ApplicationDir)
      console.log(`${app} ${ApplicationDir} created`)
    }

    var SdkVal
    var Packages
    var n = Sdk.indexOf("@extjs");
    if (n == -1) {
      SdkVal = 'ext'
      Packages = '$\u007Bworkspace.dir}/packages'
    }
    else {
      SdkVal = Sdk
      Packages = '$\u007Bworkspace.dir}/packages,node_modules/@extjs'
		}

		walkSync(TemplateDir, TemplateDir.length+1, ApplicationDir, ApplicationName, Template, SdkVal, Packages)
    var f
    f='/.sencha';fs.copySync(NodeAppApplicationTemplatesDir  + '/sencha', ApplicationDir + f);console.log(ApplicationDir + f+' created')

    var cmdVersion = options.cmdVersion
    var frameworkVersion = options.frameworkVersion

    var senchaCfg = path.join(ApplicationDir, '.sencha', 'app', 'sencha.cfg');
    fs.readFile(senchaCfg, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace('{cmdVer}', cmdVersion)
                      .replace('{frameVer}', frameworkVersion);
      fs.writeFileSync(senchaCfg, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
}
module.exports = generateApp