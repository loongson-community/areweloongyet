"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeQuality = exports.EntityKind = exports.SupportStatus = void 0;
var SupportStatus;
(function (SupportStatus) {
    // 支持状态未知，需核实
    // Unknown support status, need manual confirmation
    SupportStatus[SupportStatus["Unknown"] = 0] = "Unknown";
    // 移植被拒绝（非技术因素：商业/政治等）
    // Port was rejected because of non-technical reasons (commercial, politics,
    // etc.)
    SupportStatus[SupportStatus["Rejected"] = 1] = "Rejected";
    // 支持了，但仅有闭源/商业支持
    // 代码不可获得，甚至 blob 也不一定可获得（在必须签订合同的情况下）
    // Supported, but closed-source-only, or even only under commercial
    // contracts.
    // Source code is unavailable. Even binary blobs could be unavailable except
    // after signing contracts.
    SupportStatus[SupportStatus["CommercialOnly"] = 2] = "CommercialOnly";
    // 受阻
    // 由于移植被技术因素拒绝，或贡献者人间蒸发等其他原因，需要重启工作
    // Stalled
    // Work has to be restarted, either because a previous port was rejected
    // because of technical reasons, or the contributor(s) of a WIP port has
    // disappeared from Internet, or some other reasons.
    SupportStatus[SupportStatus["Stalled"] = 3] = "Stalled";
    // 没人做
    // No one has stepped up yet
    SupportStatus[SupportStatus["UpForGrabs"] = 4] = "UpForGrabs";
    // 施工中：有人开始做了，但没做完
    // Work-in-progress: Someone has stepped up to the work but hasn't finished
    // yet
    SupportStatus[SupportStatus["WIP"] = 5] = "WIP";
    // 正接受上游代码审查
    // Undergoing code review from upstream
    SupportStatus[SupportStatus["UnderReview"] = 6] = "UnderReview";
    // 已经合入上游，等正式版本发布（如 Git tag 等）
    // Merged into upstream, awaiting an official release (Git tags etc.)
    SupportStatus[SupportStatus["WaitingRelease"] = 7] = "WaitingRelease";
    // 已在正式版本发布（如 Git tag 等）
    // Officially released (in a Git tag etc.)
    SupportStatus[SupportStatus["Released"] = 8] = "Released";
})(SupportStatus = exports.SupportStatus || (exports.SupportStatus = {}));
var EntityKind;
(function (EntityKind) {
    // 与龙芯无关的实体
    // Entities unaffiliated with Loongson
    EntityKind[EntityKind["Community"] = 0] = "Community";
    // 与龙芯利益相关的实体，如其合作伙伴、生态圈企业等
    // Entities affiliated with Loongson, e.g. business partners or corporations
    // participating in the "Loongson ecosystem"
    EntityKind[EntityKind["Corporate"] = 1] = "Corporate";
    // 龙芯公司自身，或以龙芯员工身份活动的个人
    // The Loongson Corporation itself, or its employees acting in such capacity
    EntityKind[EntityKind["Loongson"] = 2] = "Loongson";
})(EntityKind = exports.EntityKind || (exports.EntityKind = {}));
var CodeQuality;
(function (CodeQuality) {
    // 不涉及代码，或代码不可见
    // No code is involved / code is unavailable
    CodeQuality[CodeQuality["NoCode"] = 0] = "NoCode";
    // 符合上游质量标准
    // On par with upstream quality standards
    CodeQuality[CodeQuality["OnPar"] = 1] = "OnPar";
    // 整体架构按上游标准可行，但代码风格、提交说明措辞等细节上需要清理、规范
    // Overall architecture is feasible upstream but details need cleanup, such
    // as code style or commit message wording
    CodeQuality[CodeQuality["NeedsCleanup"] = 2] = "NeedsCleanup";
    // 由于架构差异、设计决策等深层原因，毫无希望上游，需要重做
    // 如果上述条件成立，即使一个项目的代码质量优良，也应归为此类。
    // No hope of seeing this upstreamed because of deep-reaching reasons, such
    // as architectural differences or design choices; full rework is needed
    // This category should be chosen for a project even if the code quality is
    // good, as long as the defining criteria is satisfied.
    CodeQuality[CodeQuality["NeedsRework"] = 3] = "NeedsRework";
})(CodeQuality = exports.CodeQuality || (exports.CodeQuality = {}));
