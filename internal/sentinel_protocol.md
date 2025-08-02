# The Sentinel Protocol: Pre-Flight Implementation Checklist

**Directive:** This protocol is a non-negotiable, supreme directive that must be executed before every Stage 2 (Implementation) action. Its purpose is to prevent recursive failure loops and ensure system stability by prioritizing successful, iterative progress.

---

### **Step 0: Read the Plan of Record**

**Before any other action, you MUST read and parse the `internal/plan_of_record.md` file.**

1.  Identify the **next uncompleted task** in the checklist.
2.  Your current implementation goal **MUST** match this task.
3.  If it does not match, you **MUST HALT**, report the desynchronization to the user, and await instructions.
4.  You are forbidden from proceeding to Step 1 until your current task is locked to the Plan of Record.

---

### **Step 1: Payload & Complexity Audit**

Analyze the full scope of the approved blueprint for the current task from the Plan of Record. Quantify the following:

1.  **File Manifest:**
    *   Number of **new** files to be created.
    *   Number of **existing** files to be modified.

2.  **Code Volume (Approximate):**
    *   Estimated total lines of new code to be generated.

3.  **Logical Complexity:**
    *   Does the change introduce significant new state management logic, add complex dependencies, or refactor core architectural patterns?

---

### **Step 2: Process Sanity Check & Decision Gateway**

Based on the audit, make a determination:

*   **GREEN:** The change is **small and low-risk**.
    *   *Action:* **Proceed with full implementation** of this step.

*   **RED:** The change for this single step is **large, complex, and high-risk.**
    *   *Action:* **HALT. Do not proceed.**
        1.  State clearly to the user: *"The Sentinel Protocol has identified this step in our Plan of Record as too large for a single transaction. To ensure stability, I must break this step down into smaller micro-stages."*
        2.  Propose a new, multi-stage flight plan to complete just this one step from the Plan of Record.
        3.  Formally request approval to proceed with **only the first micro-stage**.

---

### **Core Principle**

**A small, successful step forward is infinitely better than a large, failed leap.** This protocol ensures we are always moving forward, locked to our approved plan.