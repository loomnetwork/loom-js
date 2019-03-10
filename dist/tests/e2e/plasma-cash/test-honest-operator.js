"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var demo_1 = require("./demo");
var complex_demo_1 = require("./complex-demo");
var challenge_after_demo_1 = require("./challenge-after-demo");
var __1 = require("../../..");
// TODO: Redeploy the Solidity contracts before each demo so the demos don't share any state.
__1.PlasmaUser.contractName = 'plasmacash';
tape_1.default('Plasma Cash ETH - Complex Demo', complex_demo_1.complexDemo);
tape_1.default('Plasma Cash with ERC721 Demo', demo_1.runDemo);
tape_1.default('Plasma Cash Challenge After Demo', challenge_after_demo_1.runChallengeAfterDemo);
//# sourceMappingURL=test-honest-operator.js.map