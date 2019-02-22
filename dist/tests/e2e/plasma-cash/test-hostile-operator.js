"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var demo_1 = require("./demo");
var challenge_after_demo_1 = require("./challenge-after-demo");
var challenge_between_demo_1 = require("./challenge-between-demo");
var challenge_before_demo_1 = require("./challenge-before-demo");
var respond_challenge_before_demo_1 = require("./respond-challenge-before-demo");
var __1 = require("../../..");
// TODO: Redeploy the Solidity contracts before each demo so the demos don't share any state.
__1.PlasmaUser.contractName = 'hostileoperator';
tape_1.default('Plasma Cash with ERC721 Demo', demo_1.runDemo);
tape_1.default('Plasma Cash Challenge After Demo', challenge_after_demo_1.runChallengeAfterDemo);
tape_1.default('Plasma Cash Challenge Between Demo', challenge_between_demo_1.runChallengeBetweenDemo);
tape_1.default('Plasma Cash Challenge Before Demo', challenge_before_demo_1.runChallengeBeforeDemo);
tape_1.default('Plasma Cash Respond Challenge Before Demo', respond_challenge_before_demo_1.runRespondChallengeBeforeDemo);
//# sourceMappingURL=test-hostile-operator.js.map