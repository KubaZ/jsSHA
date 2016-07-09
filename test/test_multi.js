/* Kind of hack to get the tests working both in the browser and node.js */
if (("undefined" !== typeof module) && module["exports"])
{
	mocha = require("mocha");
	chai = require("chai");
	jsSHA = require("../src/sha.js");
}

String.prototype.repeat = function(times) {
    return (new Array(times + 1)).join(this);
}

/* These are used often so make a global copy that everything can reference */
var millionaAscii = "a".repeat(1000000), millionaHex = "61".repeat(1000000), millionaB64 = "YWFh".repeat(333333) + "YQ==";

/* ============================================================================
 *                        Begin Multi-Round Hash Tests
 * ============================================================================
 */
var multiRoundTests = [
	{
		"hash": "SHA-1",
		"tests": [
			{
				"name": "Short",
				"ptInputs": [
					{"type": "TEXT", "value": "abc"}
				],
				"outputs": [
					{"type": "HEX", "rounds": 5, "value": "b5c64925eb9940259be55c005c9cecc7d9897ef9"},
					{"type": "HEX", "rounds": 10, "value": "94ebc0d3c81b61eb98670666f5fde68560c4e165"}
				]
			}
		]
	},
	{
		"hash": "SHA-224",
		"tests": [
			{
				"name": "Short",
				"ptInputs": [
					{"type": "TEXT", "value": "abc"}
				],
				"outputs": [
					{"type": "HEX", "rounds": 5, "value": "5b4b17f720d52c6a864229e784fb636184ca48ce7dd848fdad986239"},
					{"type": "HEX", "rounds": 10, "value": "5230eb37afcc115f4f380a9f50c4743d457bbe586e6faa6bf21696f9"}
				]
			}
		]
	},
	{
		"hash": "SHA-256",
		"tests": [
			{
				"name": "Short",
				"ptInputs": [
					{"type": "TEXT", "value": "abc"}
				],
				"outputs": [
					{"type": "HEX", "rounds": 5, "value": "184f6d6e82554c051b33f15e7ffffecb0cc0f461a29096c41c214e168e34c21d"},
					{"type": "HEX", "rounds": 10, "value": "10e286f907c0fe9f02cea3864cbaec04ae47e2c0a13b60473bc9968a4851b219"}
				]
			}
		]
	},
	{
		"hash": "SHA-384",
		"tests": [
			{
				"name": "Short",
				"ptInputs": [
					{"type": "TEXT", "value": "abc"}
				],
				"outputs": [
					{"type": "HEX", "rounds": 5, "value": "a4aa4cd8534aecb2d07765f928303d1d2609835ea85d14312bcee264e99dc5d7dc08bb18ec694053fd7fe6906706d55f"},
					{"type": "HEX", "rounds": 10, "value": "b80c82979453f2f3dcf89ec4cef5c71e89837537de170e3942af8b37757cc790d4cc4ebe16a52164ad19f3a02d192f1c"}
				]
			}
		]
	},
	{
		"hash": "SHA-512",
		"tests": [
			{
				"name": "Short",
				"ptInputs": [
					{"type": "TEXT", "value": "abc"}
				],
				"outputs": [
					{"type": "HEX", "rounds": 5, "value": "299b2e3ce932e4d0e9005345e37af5a4cc6be21e6b6e21231ce71ccde2a7aba4a6822cd7a9aaf9b13918db05ede70d3f1e6af65f8ad0bda1c4c4fa263e3cabdd"},
					{"type": "HEX", "rounds": 10, "value": "4c3ead8c83442fff47d4386702044f2a6c19730a806de541964b0fa9987cac08641611e02b2e0742ef2600ff82bfe3a711567c8e76dda16b4948f4c76e3c6e9c"}
				]
			}
		]
	}
]

multiRoundTests.forEach(function(testSuite) {
	describe("Multiround " + testSuite["hash"] + " Tests", function() {
		try
		{
			testSuite["tests"].forEach(function(test) {
				test["ptInputs"].forEach(function(ptInput) {
					test["outputs"].forEach(function(output) {
						var hash = new jsSHA(testSuite["hash"], ptInput["type"], {"numRounds": output["rounds"]});
						hash.update(ptInput["value"]);
						it(test["name"] + " " + ptInput["type"] + " Input - " + output["type"] + " Output - " + output["rounds"] + " Rounds ", function() {
							chai.assert.equal(hash.getHash(output["type"]), output["value"]);
						});
					});
				});
			});
		}
		catch(e)
		{
			if (e.message != "Chosen SHA variant is not supported")
			{
				throw new Error("Testing of multi-round " + testSuite["hash"] + " failed");
			}
		}
	});
});
/* ============================================================================
 *                        End Multi-Round Hash Tests
 * ============================================================================
 */
