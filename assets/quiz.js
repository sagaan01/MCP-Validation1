/**
 * Minimal quiz widget.
 * Usage:
 *   <div class="quiz" data-quiz data-answer="1" data-explain-ok="..." data-explain-bad="...">
 *     <h3>Check</h3>
 *     <p class="q">Question?</p>
 *     <div class="choices">
 *       <button type="button" class="choice" data-index="0">...</button>
 *       ...
 *     </div>
 *     <p class="feedback" aria-live="polite"></p>
 *   </div>
 *   <script src="../assets/quiz.js"></script>
 */
(function () {
  function wire(root) {
    var answer = String(root.getAttribute("data-answer"));
    var ok = root.getAttribute("data-explain-ok") || "Correct.";
    var bad = root.getAttribute("data-explain-bad") || "Not quite — try again.";
    var feedback = root.querySelector(".feedback");
    var choices = root.querySelectorAll("button.choice");

    choices.forEach(function (btn) {
      btn.addEventListener("click", function () {
        choices.forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");
        var correct = String(btn.getAttribute("data-index")) === answer;
        feedback.textContent = correct ? ok : bad;
        feedback.className = "feedback " + (correct ? "ok" : "bad");
      });
    });
  }

  document.querySelectorAll("[data-quiz]").forEach(wire);
})();
