(function () {
  "use strict";

  theme.init().then(()=>{

  var form = document.getElementById("chat-form");
  var input = document.getElementById("chat-input");
  var conversation = document.getElementById("conversation");
  var reviewPanel = document.getElementById("review-panel");
  var contactMessage = document.getElementById("contact-message");
  var contactEmail = document.getElementById("contact-email");
  var editButton = document.getElementById("edit-message");
  var submitButton = document.getElementById("submit-message");
  var submitStatus = document.getElementById("submit-status");
  var pendingMessage = "";
  var year = document.getElementById("year");

  year.textContent = new Date().getFullYear();

  var faq = [
    {
      terms: ["service", "services", "business", "hire", "work", "customer", "client"],
      answer: "I work on business systems, web applications, and integrations. If you describe what you need, I can help prepare a message."
    },
    {
      terms: ["inventory", "stock", "warehouse", "logistics", "tracking", "distribution"],
      answer: "I have experience with inventory, warehouse, logistics and tracking systems. Tell me a little about your current workflow or problem."
    },
    {
      terms: ["website", "web app", "web application", "pwa", "mobile", "application"],
      answer: "I build lightweight web applications and PWAs, with an emphasis on practical features and simple interfaces. What are you planning to build?"
    },
    {
      terms: ["community", "volunteer", "support", "animal", "shelter", "nonprofit", "non-profit"],
      answer: "Community projects use practical technology to address real needs. You can ask about a project or leave a message about supporting one."
    },
    {
      terms: ["source", "github", "code", "repository", "open source", "opensource"],
      answer: "Some projects and reusable tools may be shared publicly. The GitHub link on this page is a placeholder to replace with the correct profile."
    },
    {
      terms: ["contact", "email", "message", "reach", "talk", "discuss"],
      answer: "You can write your message in this box. I will let you review it before preparing a submission."
    }
  ];

  function addMessage(text, kind) {
    var message = document.createElement("p");
    message.className = "chat-message " + kind + "-message";
    message.textContent = text;
    conversation.appendChild(message);
    conversation.scrollTop = conversation.scrollHeight;
  }

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function findAnswer(text) {
    var query = normalize(text);
    var bestAnswer = "";
    var bestScore = 0;

    faq.forEach(function (item) {
      var score = 0;

      item.terms.forEach(function (term) {
        var normalizedTerm = normalize(term);
        if (query.indexOf(normalizedTerm) !== -1) {
          score += normalizedTerm.indexOf(" ") !== -1 ? 2 : 1;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestAnswer = item.answer;
      }
    });

    return bestScore ? bestAnswer : "";
  }

  function prepareReview(message) {
    pendingMessage = message;
    contactMessage.value = message;
    reviewPanel.hidden = false;
    submitStatus.textContent = "";
    contactMessage.focus();
    reviewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var message = input.value.trim();
    if (!message) {
      return;
    }

    addMessage(message, "visitor");
    input.value = "";

    var answer = findAnswer(message);

    if (answer) {
      addMessage(answer, "assistant");
      return;
    }

    addMessage("I do not have a ready answer for that. Would you like to prepare a message for the developer?", "assistant");
    prepareReview(message);
  });

  editButton.addEventListener("click", function () {
    reviewPanel.hidden = true;
    input.value = contactMessage.value || pendingMessage;
    input.focus();
  });

  submitButton.addEventListener("click", function () {
    var message = contactMessage.value.trim();
    var email = contactEmail.value.trim();

    if (!message) {
      submitStatus.textContent = "Please enter a message before continuing.";
      contactMessage.focus();
      return;
    }

    if (email && !contactEmail.checkValidity()) {
      submitStatus.textContent = "Please check the email address.";
      contactEmail.focus();
      return;
    }

    var payload = {
      message: message,
      email: email || null,
      page: window.location.href,
      createdAt: new Date().toISOString()
    };

    submitStatus.textContent = "This page is not connected to a message service yet. Your message has not been sent.";

    /*
      Backend integration point:
      Replace the status above with a POST to your server endpoint.
      Do not put private API keys or FCM server credentials in this file.
      The server should validate and rate-limit submissions, store the message,
      and then send a notification to PipKey through FCM.
    */
    console.log("Contact payload ready for backend integration:", payload);
  });

});

}());
