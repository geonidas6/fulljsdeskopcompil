const shell = require('shelljs')



shell.echo('##########################')
shell.echo('#    Building electron   #')
shell.echo('#          AND           #')
shell.echo('#    COPY MYSQL SCRIPT   #')
shell.echo('##########################')

if (!shell.test('-e', 'spring/target')) {
  shell.echo('Error: server is not built yet.')
  shell.exit(1)
}

shell.rm('-rf', 'dist')
if (shell.exec('build').code !== 0) {
  shell.echo('Error: electron build failed')
  shell.exit(1)
}


shell.echo('##########################')
shell.echo('#     ALL SUCCESSEFULL   #')
shell.echo('##########################')


