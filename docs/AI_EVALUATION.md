# AI evaluation results

These are actual results from model version 1.1.0, trained locally with scikit-learn and seed 741. The complete machine-readable record is `data/evaluation/ai_model_evaluation.json`.

This document preserves the original single-model evaluation. The deployed five-model reliability ensemble, OOD/error study, threshold trade-offs, failure cases, and efficiency results are reported separately in [AI_PHYSICS_BENCHMARK.md](AI_PHYSICS_BENCHMARK.md).

## Dataset audit

The regenerated 10,000-row dataset contained no missing values, non-finite values, duplicate rows, or duplicate feature records. Maximum energy-conservation error was `2.22e-16`. Gas mixtures, ultra-tenuous atmosphere rows, and airless-row constraints passed the artifact tests.

## Validation-set candidate comparison

| Candidate | Mean MAE | Mean RMSE | Corrections | Serious violations | Approx. size |
| --- | ---: | ---: | ---: | ---: | ---: |
| Linear Regression | 0.030590 | 0.042684 | 47.5% | 2.2% | 4.9 KB |
| Random Forest | 0.003437 | 0.008815 | 0% | 0% | 57.4 MB |
| HistGradientBoosting | 0.001520 | 0.003647 | 100% | 0% | 2.68 MB |

HistGradientBoosting was selected because its validation MAE was substantially lower than Random Forest while its artifact was much smaller. Linear Regression was fastest and smallest but materially less accurate and produced serious invalid outputs. HistGradientBoosting's frequent corrections are small energy normalizations caused by independent target regressors; the maximum validation energy-sum error was 0.03113 and no prediction crossed the serious-fallback threshold.

## Untouched test results

Errors below are fractions. Percentage-point MAE is fraction MAE multiplied by 100.

| Target | MAE | MAE, percentage points | RMSE | R² |
| --- | ---: | ---: | ---: | ---: |
| Transmitted | 0.001778 | 0.1778 | 0.004540 | 0.998919 |
| Scattered | 0.001341 | 0.1341 | 0.003047 | 0.998972 |
| Absorbed | 0.000455 | 0.0455 | 0.001293 | 0.999174 |
| Relative brightness | 0.002093 | 0.2093 | 0.004481 | 0.999867 |

Mean target MAE was 0.001417. Raw test predictions had no serious physical violations. Of 1,000 rows, 709 required minor normalization; 50 contained a slightly negative raw fraction and 34 contained a raw value slightly above one. Maximum raw energy-sum error was 0.03788 and mean error was 0.001491. Returned API values are clamped and normalized.

The saved model is 2,679,267 bytes. Measured median one-row inference was approximately 29.16 ms on the development machine. Batched test inference was approximately 0.040 ms per row; timing varies by machine and process load.

## Condition-based generalization checks

| Test group | Rows | Mean MAE | Mean RMSE | Serious violations |
| --- | ---: | ---: | ---: | ---: |
| Inner system, ≤0.75 AU | 175 | 0.001699 | 0.003827 | 0 |
| Outer system, >8 AU | 389 | 0.000963 | 0.002309 | 0 |
| Dense atmosphere, >200 kPa | 100 | 0.005753 | 0.008248 | 0 |
| Airless | 297 | 0.000362 | 0.000635 | 0 |

Dense atmospheres are the hardest tested regime. R² is intentionally reported as undefined for the three constant airless fraction targets; MAE and RMSE remain meaningful there.

## Real-body comparison

Twenty-eight of 32 catalog bodies had sufficient inputs for direct ML-versus-deterministic comparison. This includes every selectable moon and dwarf planet. Mean absolute errors across those bodies were:

| Target | MAE | MAE, percentage points |
| --- | ---: | ---: |
| Transmitted | 0.001694 | 0.1694 |
| Scattered | 0.001462 | 0.1462 |
| Absorbed | 0.000190 | 0.0190 |
| Relative brightness | 0.001618 | 0.1618 |

No serious physical violation occurred. Only Jupiter, Saturn, Uranus, and Neptune remain excluded because this surface-light model has no defensible solid-surface pressure or density for gas/ice giants.

## Independent observations

Comparison B was not performed. The local sources contain established astronomical inputs, but no independent measurements using this project's aggregate energy-partition convention. Consequently, these results support approximation fidelity only—not real-world atmospheric accuracy.
