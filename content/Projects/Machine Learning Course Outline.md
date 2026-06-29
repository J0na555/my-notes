
# [[Machine Learning]] Roadmap 

##  Goal

* Understand **core ML concepts deeply**
* Be able to **build and evaluate models from scratch**
* Finish with **real mini-projects**

---

#  RULES (read once, follow always)

* Don’t watch videos passively
* Every topic → **code it yourself**
* Always:

  ```
  Learn → Code → Break → Fix → Extend
  ```
* If something feels “easy”, you didn’t go deep enough

---

# PHASE 1 — CLASSIFICATION (Week 1)

## Main Resource

* [Your DataCamp Chapter 1 (Classification)](https://campus.datacamp.com/courses/supervised-learning-with-scikit-learn/classification-1?ex=1)

---

## Topics + Reinforcement

### 1. Binary Classification

* Understand:

  * Features vs Labels
  * What is a class

📺 Watch:

* [classification in machine learning](https://www.youtube.com/watch?v=ETChs4iQa8g)

💻 Do:

* Create dataset manually
* Predict:

  * pass/fail
  * spam/not spam

---

### 2. Supervised Learning Workflow

* MUST understand pipeline:

  ```
  load data → split → fit → predict → evaluate
  ```

💻 Do:

* Implement full workflow from scratch (no copy-paste)

---

### 3. k-Nearest Neighbors (KNN)

Core idea:

* Distance-based learning

💻 Do:

* Change K values (1, 3, 5, 10)
* Observe accuracy changes

📺 Reinforce:

* [Practical YouTube playlist](https://www.youtube.com/watch?v=M9Itm95JzL0) 

---

### 4. Model Performance

* Learn:

  * Accuracy
  * Why accuracy can lie

💻 Do:

* Create imbalanced dataset
* Test accuracy

---

### 5. Train/Test Split

💻 Do:

* Try:

  * 50/50
  * 80/20
  * 90/10

👉 Observe changes

---

### 6. Overfitting vs Underfitting

💻 Do:

* Small dataset → overfit
* Large dataset → better generalization

---

### 7. Model Complexity

💻 Do:

* Increase K → underfitting
* Decrease K → overfitting

---

## Mini Project (MANDATORY)

Pick ONE:

* Student pass prediction
* Spam classifier
* Movie genre classifier

---

#  PHASE 2 — REGRESSION (Week 2)

## Main Resource

* [DataCamp Chapter 2](https://campus.datacamp.com/courses/supervised-learning-with-scikit-learn/regression-55bf0d67-0cc2-4212-a6e5-bda0d07d3411?ex=1)

---

##  Topics

### 1. Linear Regression

💻 Do:

* Predict:

  * house prices
  * student scores

---

### 2. Model Evaluation

* Learn:

  * MSE
  * R²

---

### 3. Cross Validation

💻 Do:

* Compare:

  * with CV
  * without CV

---

### 4. Regularization

* Ridge
* Lasso

💻 Do:

* Apply both and compare results

---

##  Mini Project

* Predict:

  * expenses
  * sales
  * grades

---

#  PHASE 3 — MODEL EVALUATION & TUNING (Week 3)

## 📘 Main Resource

* [DataCamp Chapter 3](https://campus.datacamp.com/courses/supervised-learning-with-scikit-learn/fine-tuning-your-model-3?ex=1)

---

##  Topics

### 1. Metrics

* Precision
* Recall
* F1-score

---

### 2. Logistic Regression

💻 Do:

* Binary classification again with logistic regression

---

### 3. ROC Curve & AUC

* Understand model quality

---

### 4. Hyperparameter Tuning

💻 Do:

* GridSearchCV
* RandomizedSearchCV

---

## Mini Project

* Improve your Phase 1 classifier using tuning

---

# PHASE 4 — PREPROCESSING & PIPELINES (Week 4)

## Main Resource

* DataCamp Chapter 4

---

##  Topics

### 1. Data Cleaning

* Missing values
* Encoding

---

### 2. Scaling

* Standardization

---

### 3. Pipelines

💻 Do:

* Build full pipeline:

  ```
  preprocess → model → evaluate
  ```

---

##  Final Project (IMPORTANT)

Build ONE solid project:

* Student performance predictor
* Budget predictor
* Song popularity predictor

👉 Include:

* preprocessing
* model
* evaluation
* tuning

---

#  EXTRA RESOURCES (USE SMARTLY)

## 1. Documentation (VERY IMPORTANT)

* [scikit-learn official docs](https://scikit-learn.org/1.3/tutorial/basic/tutorial.html?)

Use it when:

* You don’t understand a function
* You want real-world usage

---

## 2. YouTube Strategy

Use your playlists like this:

* Stanford → concepts only
* Second playlist → implementation

 Don’t binge

---

## 3. Practice (Non-negotiable)

* Use small datasets
* Try modifying everything

---

#  WHAT YOU SHOULD MASTER BY THE END

If you can do these without help, you’re good:

* Build ML pipeline from scratch
* Choose correct model
* Evaluate properly
* Avoid overfitting
* Tune hyperparameters

---
