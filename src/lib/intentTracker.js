// 用戶意圖檢測和追蹤系統
export class IntentTracker {
  
  // 檢測用戶關注的主要領域
  static detectPrimaryConcern(message) {
    const concerns = {
      '工作': ['工作', '事業', '職場', '老闆', '同事', '升職', '轉工', '辭職', '公司', '職業', '事業運'],
      '感情': ['感情', '愛情', '另一半', '男朋友', '女朋友', '老公', '老婆', '結婚', '分手', '戀愛'],
      '財運': ['錢', '財運', '投資', '理財', '收入', '薪水', '財富', '發財', '破財', '賺錢', '生意'],
      '子女': ['子女', '小朋友', '孩子', '懷孕', '生仔', '教育', '學業', '兒子', '女兒'],
      '人際關係': ['朋友', '人際', '社交', '關係', '人緣', '貴人', '小人', '合作'],
      '桃花': ['桃花', '單身', '脫單', '姻緣', '相親', '約會', '追求'],
      '因緣': ['因緣', '緣分', '命運', '運勢', '機會', '際遇', '天時']
    };

    for (const [concern, keywords] of Object.entries(concerns)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return concern;
      }
    }
    return null;
  }

  // 生成針對特定關注領域的具體問題
  static generateSpecificQuestions(concern) {
    const questions = {
      '工作': [
        '你最想解決工作上的哪個問題？',
        '• 想知道升職加薪的時機',
        '• 考慮轉工或轉行',
        '• 職場人際關係處理',
        '• 工作壓力和倦怠',
        '• 創業或投資機會'
      ],
      '感情': [
        '你在感情方面最關心什麼？',
        '• 想知道現有關係的發展',
        '• 如何挽回或改善感情',
        '• 何時會遇到合適的人',
        '• 婚姻時機和對象選擇',
        '• 處理感情糾紛和衝突'
      ],
      '財運': [
        '你在財運方面想了解什麼？',
        '• 投資理財的最佳時機',
        '• 如何增加收入來源',
        '• 置業買房的時機',
        '• 生意合作和機會',
        '• 避免破財和損失'
      ],
      '子女': [
        '關於子女，你最想知道什麼？',
        '• 懷孕生子的最佳時機',
        '• 孩子的教育和發展',
        '• 如何改善親子關係',
        '• 孩子的健康和安全',
        '• 子女未來的運勢'
      ],
      '人際關係': [
        '在人際關係上，你遇到什麼困擾？',
        '• 如何改善職場人際關係',
        '• 處理朋友間的矛盾',
        '• 遇到貴人的機會',
        '• 避免小人和是非',
        '• 擴展社交圈子'
      ],
      '桃花': [
        '關於桃花運，你想改善什麼？',
        '• 何時會有桃花出現',
        '• 如何提升個人魅力',
        '• 適合的對象類型',
        '• 脫單的最佳時機',
        '• 避免爛桃花'
      ],
      '因緣': [
        '關於人生方向，你想了解什麼？',
        '• 人生的使命和目標',
        '• 重要的人生轉捩點',
        '• 如何把握機會',
        '• 化解人生困局',
        '• 尋找生命中的貴人'
      ]
    };

    return questions[concern] || questions['工作'];
  }

  // 檢查用戶是否確認了建議的問題
  static checkUserConfirmation(message) {
    const confirmWords = ['對', '是', '正確', '沒錯', '就是', '確實', '同意', 'OK', 'ok', '好', '係'];
    const denyWords = ['不是', '不對', '錯', '不同', '其他', '另外', '不一樣', '不准確'];
    
    const hasConfirm = confirmWords.some(word => message.includes(word));
    const hasDeny = denyWords.some(word => message.includes(word));
    
    if (hasConfirm && !hasDeny) return 'confirmed';
    if (hasDeny) return 'denied';
    return 'unclear';
  }

  // 從用戶回應中提取具體問題
  static extractSpecificProblem(message, concern) {
    // 如果用戶直接描述問題，提取關鍵內容
    const problemIndicators = ['想知道', '關心', '擔心', '希望', '問題是', '困擾是', '煩惱是'];
    
    for (const indicator of problemIndicators) {
      if (message.includes(indicator)) {
        const index = message.indexOf(indicator);
        return message.substring(index).trim();
      }
    }
    
    // 如果沒有明確指示詞，返回整個消息作為問題描述
    return message.trim();
  }
}

  // 檢測是否為具體問題
  static isSpecificQuestion(message) {
    const questionIndicators = [
      '點解', '為什麼', '怎麼', '如何', '可以', '應該', '會不會', 
      '是否', '能否', '什麼時候', '幾時', '邊個', '邊度',
      '?', '？', '想知', '想問', '請問'
    ];
    
    return questionIndicators.some(indicator => message.includes(indicator)) || 
           message.length > 10; // 長訊息通常是具體問題
  }

  // 生成跟進問題
  static generateFollowUpQuestion(concern) {
    const followUpQuestions = {
      '工作': [
        '關於工作，你最想了解嘅係咩？',
        '1. 現在工作嘅困難同挑戰',
        '2. 升職加薪嘅機會',  
        '3. 轉工換公司嘅時機',
        '4. 創業做生意嘅可能性',
        '5. 同老闆同事嘅關係',
        '6. 其他工作相關問題',
        '',
        '你可以簡單講下你嘅具體情況，我會為你提供針對性嘅建議。'
      ],
      '感情': [
        '關於感情，你想了解邊方面？',
        '1. 現有關係嘅發展',
        '2. 單身脫單嘅時機', 
        '3. 感情中嘅困擾',
        '4. 結婚嘅可能性',
        '5. 分手復合嘅問題',
        '6. 其他感情問題',
        '',
        '你可以分享下你嘅感情狀況，我會給你專業嘅分析。'
      ],
      '財運': [
        '關於財運，你最關心咩？',
        '1. 收入增加嘅機會',
        '2. 投資理財嘅建議',
        '3. 生意發展嘅前景',
        '4. 破財漏財嘅問題', 
        '5. 偏財正財嘅運勢',
        '6. 其他財運問題',
        '',
        '講下你嘅財務狀況同目標，我會為你分析財運。'
      ],
      '子女': [
        '關於子女，你想知道咩？',
        '1. 懷孕生育嘅時機',
        '2. 子女嘅學業運勢',
        '3. 親子關係嘅改善',
        '4. 子女嘅健康發展',
        '5. 教育方向嘅選擇',
        '6. 其他子女問題',
        '',
        '分享下你嘅具體情況，我會給你相關建議。'
      ],
      '人際關係': [
        '關於人際關係，你想了解咩？',
        '1. 職場人際嘅處理',
        '2. 朋友關係嘅維持',
        '3. 貴人運嘅提升',
        '4. 小人是非嘅化解',
        '5. 社交能力嘅改善',
        '6. 其他人際問題',
        '',
        '講下你遇到嘅人際困擾，我會提供解決方案。'
      ],
      '桃花': [
        '關於桃花運，你想知道咩？',
        '1. 桃花運嘅時機',
        '2. 理想對象嘅出現',
        '3. 桃花位嘅佈置',
        '4. 脫單嘅方法',
        '5. 爛桃花嘅化解',
        '6. 其他桃花問題',
        '',
        '分享下你嘅感情期望，我會分析你嘅桃花運。'
      ],
      '因緣': [
        '關於因緣際遇，你想了解咩？',
        '1. 人生機會嘅把握',
        '2. 重要決定嘅時機',
        '3. 命運轉折嘅預測',
        '4. 因緣際遇嘅分析',
        '5. 運勢起伏嘅週期',
        '6. 其他命運問題',
        '',
        '講下你現在面對嘅選擇或困惑，我會為你分析因緣。'
      ]
    };

    return followUpQuestions[concern] ? followUpQuestions[concern].join('\n') : '';
  }

  // 生成付費連結
  static generatePaymentLink(concern, userId) {
    const serviceMap = {
      '工作': 'career-fengshui',
      '感情': 'relationship-fengshui', 
      '財運': 'wealth-fengshui',
      '子女': 'children-fengshui',
      '人際關係': 'relationship-fengshui',
      '桃花': 'love-luck-fengshui',
      '因緣': 'destiny-fengshui'
    };

    const serviceId = serviceMap[concern];
    return `/payment/${serviceId}?userId=${userId}&concern=${encodeURIComponent(concern)}`;
  }

  // 檢測是否準備付費
  static isReadyForPayment(conversationHistory) {
    // 檢查是否已經有主要關注點和具體問題
    const hasSpecificQuestion = conversationHistory.some(msg => 
      msg.intent === 'specific_question' && msg.userMessage.length > 15
    );
    
    return hasSpecificQuestion;
  }
}

// 對話狀態管理
export class ConversationState {
  static states = {
    GREETING: 'greeting',
    DETECTING_CONCERN: 'detecting_concern', 
    ASKING_SPECIFIC: 'asking_specific',
    READY_FOR_PAYMENT: 'ready_for_payment',
    PAYMENT_PENDING: 'payment_pending',
    REPORT_GENERATION: 'report_generation'
  };

  static getNextState(currentState, userMessage, hasProfile) {
    const concern = IntentTracker.detectPrimaryConcern(userMessage);
    const isSpecific = IntentTracker.isSpecificQuestion(userMessage);

    switch (currentState) {
      case this.states.GREETING:
        if (concern) {
          return this.states.ASKING_SPECIFIC;
        }
        return this.states.DETECTING_CONCERN;

      case this.states.DETECTING_CONCERN:
        if (concern) {
          return this.states.ASKING_SPECIFIC;
        }
        return this.states.DETECTING_CONCERN;

      case this.states.ASKING_SPECIFIC:
        if (isSpecific && hasProfile) {
          return this.states.READY_FOR_PAYMENT;
        }
        return this.states.ASKING_SPECIFIC;

      default:
        return currentState;
    }
  }
}

// CommonJS 導出（為了測試）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IntentTracker, ConversationState };
}
