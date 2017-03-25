
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const js_yaml = require('js-yaml');
const fileUrl = './convos/rawJson/11_Ana.json';
const baseName = path.basename(fileUrl, '.json');

const convoJson = require(fileUrl);

const [femaleUserId, femaleFirstName] = baseName.split('_');
const OUTPUT_YAML = `scripts/convos/yaml/${baseName}.yml`;

const SELF = 'self';
const GIRL = 'girl';
const NARRATOR = 'narrator';
const BRANCH = 'branch';

const threads = {};

const createMessage = function(element, curThreadLen) {
  const userId = getUserId(element);
  return {
    text: element.text,
    msg_id: curThreadLen,
    usr_id: Number(userId),
    wait_sec: Number(element.wait_sec)
  }
};

const getUserId = function(element) {
  switch(element.type) {
    case SELF:
      return 1;
    case GIRL:
      return femaleUserId;
    case NARRATOR:
      return 2;
  }
};

const createLinearBranch = function(element) {
  return {
    branch_type: 'linear',
    branch_target: element.next_thread,
    decisions: []
  }
};

const createMultiBranch = function(element) {
  const decisions = [
    {
      dec_id: 0,
      text: element.option_a_text,
      target_thread: element.option_a_thread
    },
    {
      dec_id: 1,
      text: element.option_b_text,
      target_thread: element.option_b_thread

    }
  ];

  return {
    branch_type: 'multi',
    branch_target: '',
    decisions
  }
};

const createTerminalBranch = function(element) {
  return {
    branch_type: 'terminal',
    branch_target: '',
    decisions: []
  }
};

convoJson.forEach(function(element, i) {
  const thread = element.thread;

  const currentThread = threads[thread] = threads[thread] || {};
  const messages = currentThread.messages = currentThread.messages || [];

  const platform = element.platform;
  currentThread.platform = platform;
  currentThreadLen = currentThread.messages.length;

  const isMessage = [SELF, GIRL, NARRATOR].includes(element.type);
  const isMultiBranch = [BRANCH].includes(element.type);
  const isLinearBranch = element.next_thread;
  const isTerminal = element.terminal;

  if (isMessage) {
    const newMessage = createMessage(element, currentThreadLen);
    messages.push(newMessage);
  }

  if (isLinearBranch) {
    currentThread.branch = createLinearBranch(element);
  }

  if (isMultiBranch) {
    currentThread.branch = createMultiBranch(element);
  }

  if (isTerminal) {
    currentThread.branch = createTerminalBranch(element);
  }
});

// console.log(util.inspect(threads, {showHidden: false, depth: 4}))

saveThreadsYaml = js_yaml.safeDump(threads);
fs.outputFileSync(OUTPUT_YAML, saveThreadsYaml);
