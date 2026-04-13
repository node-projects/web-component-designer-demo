export var EvaluationStatusFlags;
(function (EvaluationStatusFlags) {
    EvaluationStatusFlags[EvaluationStatusFlags["NotEvaluated"] = 1] = "NotEvaluated";
    EvaluationStatusFlags[EvaluationStatusFlags["Success"] = 2] = "Success";
    EvaluationStatusFlags[EvaluationStatusFlags["EvaluatorNotFound"] = 4] = "EvaluatorNotFound";
    EvaluationStatusFlags[EvaluationStatusFlags["SyntaxError"] = 8] = "SyntaxError";
    EvaluationStatusFlags[EvaluationStatusFlags["InvalidCode"] = 16] = "InvalidCode";
    EvaluationStatusFlags[EvaluationStatusFlags["InvalidContext"] = 32] = "InvalidContext";
    EvaluationStatusFlags[EvaluationStatusFlags["OtherError"] = 64] = "OtherError";
})(EvaluationStatusFlags || (EvaluationStatusFlags = {}));
//# sourceMappingURL=EvaluationStatusFlags.js.map