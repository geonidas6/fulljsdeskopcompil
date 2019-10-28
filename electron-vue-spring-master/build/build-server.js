const shell = require('shelljs')

//------debut add angular
//enmode dev pour lancer le serveur ng serve --open port 4200

shell.echo('serve')


shell.echo('##########################')
shell.echo('#     Building angular   #')
shell.echo('##########################')

shell.cd('angular')
const PUBLIC = '../spring/src/main/resources/public/'
shell.rm('-rf', PUBLIC);
if (shell.exec('ng build').code !== 0) {
  shell.echo('Error: angular build server failed')
  shell.exit(1)
}
shell.cp('-R', 'dist/angular/', PUBLIC)
shell.cd('..')
//end add angular





shell.echo('##########################')
shell.echo('#     Building spring    #')
shell.echo('##########################')

shell.cd('spring')
const mvnw = process.platform === 'win32' ? 'mvnw' : './mvnw'
if (shell.exec(mvnw + ' clean package').code !== 0) {
  shell.echo('Error: spring build server failed')
  shell.echo('pateform: '+process.platform)
  shell.exit(1)
}
