import {signal} from './utils';
import {createRunner} from './create-runner';

interface Result {
  msg: string;
  taskPosition: number;
  pass: boolean;
  change: number;
  timedOut?: boolean;
};

interface Config {
  dir: string;
  taskPosition: number;
}

export default function runner(testFile, config: Config, handleResult, handleLog) {

  let runner = createRunner(config, testFile);
  var final = null;
  let signalMatch = new RegExp(signal);

  return new Promise((resolve, reject) => {
    runner.stdout.on('data', function(data): void {

      data = data.toString();

      // parse only final output data
      // let match = signalMatch.exec(data); // 0
      //
      // if (!match) {
      //   handleLog(data);
      //   return;
      // }
      //
      // /* Result */
      // // transform string result into object
      // let resultString = data.substring(match.index + signal.length);
      let result = JSON.parse(JSON.stringify(data));
      // // why parse twice? I don't know, but it works
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }

      let finish = result.asserts[result.asserts.length - 1];
      let obj = getIndexAndTitle(finish.comment);

      if (result.stats.failures > 0) {
        // fail: return first failure
        final = {
          msg: obj.msg,
          taskPosition: obj.index - 1
        };
      } else {
        // pass
        final = {
          msg: `Task ${obj.index} Complete`,
          taskPosition: obj.index
        };
      }
      final.change = final.taskPosition - config.taskPosition;
      final.pass = final.change > 0;
      // // return result to atom-coderoad
      handleResult(final);
    });

    runner.stderr.on('data', function(data) {
      console.log('test error', data.toString());
    });

    runner.on('close', function(code) {
      if (code === 0) {
        resolve(final);
      } else {
        resolve(final);
      }
    });
  });
}

function getIndexAndTitle(title: string): { index: number, msg: string } {
  // tests prefixed with task number: "01 title"
  let indexString = title.match(/^[0-9]+/);
  if (!indexString) {
    throw 'Tests should begin with a number, indicating the task number';
  }
  return {
    index: parseInt(indexString[0]),
    msg: title.slice(indexString[0].length + 1)
  };
}
