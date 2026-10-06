/* Micro Mastery — course content.
   Source: OpenStax, Principles of Microeconomics 3e (openstax.org/books/principles-microeconomics-3e).
   Section numbers and examples follow the book so you can flip between the two. */

window.MM = window.MM || {};

MM.chapters = [
  /* ------------------------------------------------------------------ CH 1 */
  {
    id: "ch1",
    num: 1,
    title: "Welcome to Economics!",
    short: "Welcome to Economics",
    sub: "Scarcity, models, economic systems",
    bigIdea: "Everything you want competes for the same limited time, money and materials. Economics is the study of how people and societies choose under that pressure.",
    sections: [
      {
        num: "1.1",
        title: "What is economics, and why is it important?",
        idea: "Economics studies how individuals, firms and societies make choices when resources are scarce.",
        points: [
          ["Scarcity", "Human wants are bigger than the resources available to satisfy them. It applies to time, attention and land, not only money."],
          ["Division of labor", "Splitting production into separate tasks. Adam Smith's pin factory (The Wealth of Nations, 1776) showed a team of specialists making far more pins than the same people each working alone."],
          ["Why specialization raises output", "People work on what they are best at, get faster with practice, and firms can use economies of scale, where average cost falls as output grows."],
          ["Trade makes it work", "If you specialize, you have to trade to get everything else. Markets and money are what make that exchange easy."]
        ],
        example: "At a campus coffee shop, one person takes orders, one pulls shots and one steams milk. Together they serve more drinks per hour than three people each making whole drinks start to finish.",
        trap: "Scarcity is not the same as being poor. A billionaire still has only 24 hours a day, so she still faces scarcity.",
        check: {
          prompt: "Which situation is an example of scarcity?",
          options: ["A store has 200 extra umbrellas on a sunny day", "You have two exams and one evening to study", "A firm makes more pins after dividing the work", "Prices rise across the whole economy"],
          correct: 1,
          explain: "Two exams compete for one evening. Wants exceed the time available, so you must choose."
        }
      },
      {
        num: "1.2",
        title: "Microeconomics and macroeconomics",
        idea: "Same tools, different zoom level.",
        points: [
          ["Microeconomics", "Individual agents and single markets: households, workers, firms, the market for nurses or for coffee."],
          ["Macroeconomics", "The economy as a whole: GDP, unemployment, inflation, growth, and government policy aimed at them."],
          ["Monetary policy", "Central bank policy on interest rates and credit (the Federal Reserve in the U.S.). A macro topic."],
          ["Fiscal policy", "Government spending and taxes. Also macro."]
        ],
        example: "How a single H-E-B decides the price of tortillas is micro. Why prices across the whole U.S. rose 3% this year is macro.",
        trap: "Size is not the test. Walmart's pricing decision is micro even though Walmart is huge. The question is whether you are looking at one decision-maker or market, or the whole economy.",
        check: {
          prompt: "Which question belongs to macroeconomics?",
          options: ["Why did the price of eggs at one store rise?", "How many workers should a restaurant hire?", "Why did the national unemployment rate fall?", "Should you buy or rent textbooks?"],
          correct: 2,
          explain: "The national unemployment rate describes the whole economy. The other three are single decision-makers or markets."
        }
      },
      {
        num: "1.3",
        title: "How economists use theories and models",
        idea: "A model is a simplified picture of how a few variables interact. It leaves things out on purpose so you can see the relationship.",
        points: [
          ["Theory", "A simplified representation of how two or more variables interact."],
          ["Model", "A more applied version of a theory, often a diagram or equation. The book uses the two words almost interchangeably."],
          ["Ceteris paribus", "\"Other things being equal.\" Hold everything else constant so you can see one cause and its effect."],
          ["Circular flow diagram", "Households and firms interact in two markets. In the goods and services market, firms sell output and households pay for it. In the labor market, households supply work and firms pay wages."]
        ],
        example: "A campus map leaves out every tree and parking space. That is what makes it useful for finding the business building.",
        trap: "A model is not wrong because it is unrealistic. It is judged by whether it explains and predicts the thing you care about.",
        check: {
          prompt: "In the circular flow diagram, which arrow runs from households to firms?",
          options: ["Goods and services", "Wages and salaries", "Labor", "Profits"],
          correct: 2,
          explain: "Households supply labor to firms in the labor market. Firms send back wages. Firms send goods to households, and households send back spending."
        }
      },
      {
        num: "1.4",
        title: "How to organize economies",
        idea: "Every society has to answer what to produce, how, and for whom. Economic systems are different ways of answering.",
        points: [
          ["Traditional economy", "Decisions follow custom and family roles, often agricultural. You do what your parents did."],
          ["Command economy", "Government decides what is produced, how, and who gets it. The Soviet Union and North Korea are the standard examples."],
          ["Market economy", "Decisions are decentralized. Private individuals and firms make choices, coordinated by prices, with private property."],
          ["Mixed economy", "Every real economy mixes market and government. Even market economies rely on government for rules, courts and some goods."],
          ["Globalization", "The growing link between national economies through trade, investment and the movement of people and ideas."]
        ],
        example: "The U.S. is mostly market-based, but government still sets food safety rules, runs public schools and funds roads.",
        trap: "\"Market economy\" does not mean no government. Markets depend on enforced property rights and contracts.",
        check: {
          prompt: "In a market economy, what mainly coordinates millions of separate decisions?",
          options: ["A central planning office", "Prices", "Tradition", "Elections"],
          correct: 1,
          explain: "Prices carry information about what is scarce and what people value. Section 4.3 comes back to this idea."
        }
      }
    ],
    labs: ["circularFlow", "sortMicroMacro"],
    cards: [
      ["Scarcity", "Wants are greater than the resources available. It forces every choice. Time is scarce too."],
      ["Division of labor", "Splitting work into specialized tasks. Raises output through skill, practice and economies of scale."],
      ["Economies of scale", "Average cost of producing each unit falls as total output rises."],
      ["Microeconomics", "Individual households, workers, firms and single markets."],
      ["Macroeconomics", "The whole economy: GDP, unemployment, inflation, growth, fiscal and monetary policy."],
      ["Theory vs model", "Theory: simplified representation of how variables interact. Model: a more applied version, often a diagram."],
      ["Ceteris paribus", "Other things being equal. Hold everything else constant to isolate one cause and effect."],
      ["Circular flow", "Goods market: firms → goods → households, households → spending → firms. Labor market: households → labor → firms, firms → wages → households."],
      ["Command economy", "Government decides what, how and for whom to produce."],
      ["Market economy", "Decentralized decisions by individuals and firms, coordinated by prices, with private ownership."],
      ["Globalization", "Growing connection of national economies through trade, investment and movement of people and ideas."]
    ],
    questions: [
      { id: "c1-1", prompt: "Economics is best defined as the study of:", options: ["Money and banking", "How people and societies make choices under scarcity", "The stock market", "How to get rich"], correct: 1, explain: "OpenStax 1.1: economics studies how individuals, firms and societies make decisions when resources are scarce. Money is one topic inside it, not the definition.", wrong: { 0: "Money and banking is one topic inside economics. Scarcity and choice is the definition." } },
      { id: "c1-2", prompt: "Adam Smith's pin factory illustrates:", options: ["Command economies", "The division of labor", "Inflation", "Price ceilings"], correct: 1, explain: "Specialized workers each doing one step made far more pins than the same workers each making whole pins." },
      { id: "c1-3", prompt: "Which is NOT a reason the division of labor raises output?", options: ["Workers specialize in what they are good at", "Workers get faster with practice", "Economies of scale", "It removes scarcity"], correct: 3, explain: "Specialization helps you get more from scarce resources. It never removes scarcity." },
      { id: "c1-4", prompt: "A firm's average cost per unit falls as it produces more. This is called:", options: ["Diminishing returns", "Economies of scale", "Ceteris paribus", "Opportunity cost"], correct: 1, explain: "Economies of scale: larger production lowers average cost. It is one reason specialization pays off." },
      { id: "c1-5", prompt: "Which topic is microeconomics?", options: ["The national inflation rate", "Federal Reserve interest rate policy", "How a restaurant sets menu prices", "U.S. GDP growth"], correct: 2, explain: "One firm's decision is micro. The other three describe or steer the whole economy.", wrong: { 1: "Fed policy aims at the whole economy, so it is macro (monetary policy)." } },
      { id: "c1-6", prompt: "Why do economists use ceteris paribus?", options: ["To make models more realistic", "To hold other factors constant and isolate one effect", "Because everything changes together", "It defines equilibrium"], correct: 1, explain: "Holding all else equal lets you see one cause and one effect at a time." },
      { id: "c1-7", prompt: "In the circular flow diagram, wages flow:", options: ["From households to firms", "From firms to households", "From government to firms", "Only in the goods market"], correct: 1, explain: "Firms pay wages to households in the labor market, in return for the labor households supply." },
      { id: "c1-8", prompt: "An economic model is:", options: ["Useless if it leaves out details", "A simplified representation used to understand reality", "Always mathematical", "A prediction that is always right"], correct: 1, explain: "Models simplify on purpose. A map without every tree is still the best way to find your class." },
      { id: "c1-9", prompt: "In a command economy, who decides what gets produced?", options: ["Consumers through prices", "Custom and tradition", "The government", "Foreign trade partners"], correct: 2, explain: "Command = central authority directs production. Market = prices coordinate. Traditional = custom decides." },
      { id: "c1-10", prompt: "The U.S. economy is best described as:", options: ["Pure market", "Pure command", "Mixed, mostly market-based", "Traditional"], correct: 2, explain: "Markets allocate most goods, while government sets rules, taxes, and provides some goods and services." },
      { id: "c1-11", prompt: "Globalization refers to:", options: ["Government control of trade", "Growing links between national economies through trade, investment and people", "A single world currency", "Only internet commerce"], correct: 1, explain: "Trade, investment and movement of people and ideas across borders have all grown over time." }
    ]
  },

  /* ------------------------------------------------------------------ CH 2 */
  {
    id: "ch2",
    num: 2,
    title: "Choice in a World of Scarcity",
    short: "Choice in a World of Scarcity",
    sub: "Budget constraint, PPF, opportunity cost",
    bigIdea: "Every choice has a price tag measured in what you give up. The budget constraint shows it for one person, the PPF shows it for a whole society.",
    sections: [
      {
        num: "2.1",
        title: "How individuals make choices based on their budget constraint",
        idea: "Your budget constraint is every combination you can afford. Its slope is your opportunity cost.",
        points: [
          ["Budget constraint", "All combinations of two goods you can buy with a fixed budget at given prices. Alphonso has $10 a week for burgers ($2) and bus tickets ($0.50)."],
          ["Opportunity cost", "The value of the next best alternative you give up. For Alphonso, 1 burger costs 4 bus tickets ($2 ÷ $0.50)."],
          ["Marginal analysis", "Compare the benefit and cost of a little more or a little less. Most real choices are \"one more hour?\" not \"all or nothing\"."],
          ["Sunk costs", "Costs already paid that you cannot recover. They should not affect what you do next."],
          ["Utility", "The satisfaction you get from a good. Diminishing marginal utility: each extra unit adds less satisfaction than the one before."]
        ],
        example: "You paid $40 for a concert ticket but feel sick. The $40 is gone whether you go or not, so decide only on whether going tonight is better than staying home.",
        trap: "Opportunity cost is the next best alternative, not every alternative added together.",
        formula: "Opportunity cost of X = Price of X ÷ Price of Y  (measured in units of Y)",
        check: {
          prompt: "Burgers cost $2 and bus tickets cost $0.50. The opportunity cost of one burger is:",
          options: ["0.25 bus tickets", "2 bus tickets", "4 bus tickets", "$2"],
          correct: 2,
          explain: "$2 ÷ $0.50 = 4. Buying one more burger means giving up 4 bus tickets."
        }
      },
      {
        num: "2.2",
        title: "The production possibilities frontier and social choices",
        idea: "The PPF is a society's budget constraint: the most it can produce of two goods with its resources and technology.",
        points: [
          ["PPF", "The book uses health care and education. On the curve, getting more of one means giving up some of the other."],
          ["Law of increasing opportunity cost", "As you make more of a good, each extra unit costs more of the other good. Resources are not equally suited to both uses. This is why the PPF bows outward."],
          ["Productive efficiency", "You cannot produce more of one good without producing less of another. Every point on the PPF is productively efficient."],
          ["Allocative efficiency", "The particular point on the PPF that society most wants. Only one point gets this."],
          ["Inside vs outside", "Inside the PPF = wasted resources (unemployment, inefficiency). Outside = not possible today. Economic growth shifts the PPF outward."],
          ["Comparative advantage", "Producing a good at a lower opportunity cost than someone else. Brazil has it in sugar cane, the U.S. in wheat."],
          ["Absolute advantage", "Producing more output with the same resources. You can have it in both goods and still gain from trade."]
        ],
        example: "Moving the first doctors from schools to hospitals costs little education. Moving the last teachers who are bad at medicine costs a lot. Each step along the PPF gets more expensive.",
        trap: "Comparative advantage is about opportunity cost, not who is faster. Someone who is better at everything still has a comparative advantage in only one of two goods.",
        formula: "Opportunity cost of 1 X = what you give up ÷ what you get",
        check: {
          prompt: "Why is the PPF bowed outward?",
          options: ["Prices rise over time", "Resources are not equally suited to every good, so opportunity cost rises", "Technology always improves", "People get tired of one good"],
          correct: 1,
          explain: "The law of increasing opportunity cost. Each additional unit pulls in resources that are worse at making it."
        }
      },
      {
        num: "2.3",
        title: "Confronting objections to the economic approach",
        idea: "Economics describes how people behave. It is not telling you how you should behave.",
        points: [
          ["\"People don't think like this\"", "Basketball players do not calculate physics, yet physics still explains a pass. Shoppers do not draw budget lines, yet the model still describes their choices."],
          ["Positive statement", "Describes the world as it is. It can be tested with evidence."],
          ["Normative statement", "Describes how the world should be. It rests on values and opinion."],
          ["The line can blur", "Real policy debates mix both. Economists try to keep the facts separate from the values."]
        ],
        example: "\"Raising tuition 10% would lower enrollment by 3%\" is positive. You can check it. \"Tuition should be free\" is normative.",
        trap: "A positive statement can be false and still be positive. \"The moon is made of cheese\" is positive because you can test it.",
        check: {
          prompt: "Which statement is normative?",
          options: ["Higher gas taxes reduce driving", "Unemployment was 4% last year", "The minimum wage should be raised", "If tuition rises, enrollment falls"],
          correct: 2,
          explain: "\"Should\" signals a value judgment. The other three can be checked against data."
        }
      }
    ],
    labs: ["budget", "ppf", "trade", "sortPosNorm"],
    cards: [
      ["Budget constraint", "Every combination of two goods you can afford with a fixed budget at given prices."],
      ["Opportunity cost", "The value of the next best alternative given up."],
      ["Alphonso's opportunity cost", "$10 budget, burgers $2, bus tickets $0.50. One burger costs 4 bus tickets."],
      ["Marginal analysis", "Weighing the benefit and cost of a little more or a little less."],
      ["Sunk cost", "Already paid and unrecoverable. Ignore it when deciding what to do next."],
      ["Diminishing marginal utility", "Each additional unit of a good adds less satisfaction than the one before."],
      ["PPF", "Maximum combinations of two goods a society can produce with its resources and technology."],
      ["Law of increasing opportunity cost", "More of a good means each extra unit costs more of the other. Makes the PPF bow outward."],
      ["Productive efficiency", "Can't make more of one good without less of another. Every point on the PPF."],
      ["Allocative efficiency", "The point on the PPF society most desires."],
      ["Comparative advantage", "Producing at a lower opportunity cost than someone else. The basis of gains from trade."],
      ["Absolute advantage", "Producing more with the same resources. Not what decides who should specialize."],
      ["Positive vs normative", "Positive = what is (testable). Normative = what should be (values)."]
    ],
    questions: [
      { id: "c2-1", prompt: "A budget constraint shows:", options: ["Every combination you want", "Every combination you can afford at given prices and income", "Only the combination that maximizes utility", "A society's production limits"], correct: 1, explain: "It is the affordability line. The PPF is the society-level version for production." },
      { id: "c2-2", prompt: "Alphonso doubles his weekly budget to $20. Prices stay $2 per burger and $0.50 per ticket. His budget line:", options: ["Gets steeper", "Shifts out parallel", "Rotates inward", "Does not move"], correct: 1, explain: "More income, same prices: the line shifts out with the same slope. The opportunity cost of a burger is still 4 tickets.", wrong: { 0: "Slope depends on relative prices. Prices didn't change, so the slope stays the same." } },
      { id: "c2-3", prompt: "You can make 4 tacos or 2 burgers in an hour. The opportunity cost of 1 burger is:", options: ["0.5 tacos", "2 tacos", "4 tacos", "2 burgers"], correct: 1, explain: "Give up 4 tacos to get 2 burgers. 4 ÷ 2 = 2 tacos per burger." },
      { id: "c2-4", prompt: "You already spent $300 on a non-refundable trip. A better offer comes up for the same weekend. The $300 should:", options: ["Make you go on the trip", "Be ignored, because it is a sunk cost", "Be added to the cost of the new offer", "Be split between the options"], correct: 1, explain: "The $300 is gone in both cases. Compare only the future benefits and costs of each option." },
      { id: "c2-5", prompt: "A PPF with constant opportunity cost is:", options: ["Bowed out", "A straight line", "Vertical", "Bowed in"], correct: 1, explain: "Same trade-off at every point means a constant slope, so a straight line. Increasing opportunity cost bows it outward." },
      { id: "c2-6", prompt: "A point inside the PPF means:", options: ["The point is unattainable", "Resources are being wasted. More of both is possible", "Allocative efficiency", "Economic growth"], correct: 1, explain: "Inside = productively inefficient. Unemployment and waste put an economy inside its PPF." },
      { id: "c2-7", prompt: "The law of increasing opportunity cost explains:", options: ["Why prices rise", "Why the PPF bows outward", "Why budget lines are straight", "Why trade is harmful"], correct: 1, explain: "Each additional unit requires resources less suited to producing it, so it costs more of the other good." },
      { id: "c2-8", prompt: "Allocative efficiency is:", options: ["Any point on the PPF", "The point on the PPF that society most desires", "Any point inside the PPF", "Producing the most of one good"], correct: 1, explain: "Every point on the PPF is productively efficient. Only the most-desired point is allocatively efficient.", wrong: { 0: "That describes productive efficiency. Allocative efficiency is one specific point on the curve." } },
      { id: "c2-9", prompt: "You make 6 problem sets or 3 essays per night. Your friend makes 4 problem sets or 4 essays. Who has comparative advantage in essays?", options: ["You", "Your friend", "Neither", "Both"], correct: 1, explain: "Your essay costs 2 problem sets (6 ÷ 3). Your friend's costs 1 (4 ÷ 4). Lower opportunity cost = comparative advantage." },
      { id: "c2-10", prompt: "Ava makes 10 lattes or 5 pastries. Ben makes 8 lattes or 4 pastries. Who has a comparative advantage in pastries?", options: ["Ava", "Ben", "Neither. Their opportunity costs are equal", "Both"], correct: 2, explain: "Both give up 2 lattes per pastry. Equal opportunity costs mean no comparative advantage and no gains from specializing.", wrong: { 0: "Ava has an absolute advantage (more of both), but her opportunity cost is the same as Ben's." } },
      { id: "c2-11", prompt: "Economic growth appears on the PPF as:", options: ["A move inside the curve", "The PPF shifting outward", "The PPF shifting inward", "A move along the curve"], correct: 1, explain: "More resources or better technology let society produce more of both goods." },
      { id: "c2-12", prompt: "Which is a positive statement?", options: ["We should tax soda", "Tuition is too high", "If tuition rises, enrollment falls, ceteris paribus", "Inequality is unfair"], correct: 2, explain: "It describes cause and effect you can test. \"Should,\" \"too high\" and \"unfair\" are value judgments." }
    ]
  },

  /* ------------------------------------------------------------------ CH 3 */
  {
    id: "ch3",
    num: 3,
    title: "Demand and Supply",
    short: "Demand and Supply",
    sub: "Shifts, equilibrium, price controls",
    core: true,
    bigIdea: "Buyers and sellers meet at the price where the amount people want equals the amount offered. Learn to tell a shift from a movement and the rest of the course gets easier.",
    sections: [
      {
        num: "3.1",
        title: "Demand, supply and equilibrium",
        idea: "Demand and supply are whole schedules of price and quantity. Equilibrium is where they agree.",
        points: [
          ["Demand", "The amount buyers are willing and able to buy at each price. The whole curve."],
          ["Quantity demanded", "The amount at one specific price. One point on the curve."],
          ["Law of demand", "Price up, quantity demanded down, ceteris paribus."],
          ["Law of supply", "Price up, quantity supplied up. Higher prices make producing more worth it."],
          ["Equilibrium", "The price where quantity demanded equals quantity supplied. No pressure to change."],
          ["Surplus (excess supply)", "Price above equilibrium. Sellers have unsold goods and cut prices."],
          ["Shortage (excess demand)", "Price below equilibrium. Buyers compete and push prices up."]
        ],
        example: "Gas at $5 a gallon: drivers buy less and stations want to sell more. If $5 is above equilibrium, unsold gas builds up and prices drift down.",
        trap: "\"Demand rose\" and \"quantity demanded rose\" are different. A price change only moves you along the curve.",
        check: {
          prompt: "At $12, 40 concert tickets are demanded and 80 are supplied. This market has:",
          options: ["A shortage of 40", "A surplus of 40", "Equilibrium", "A shortage of 80"],
          correct: 1,
          explain: "80 supplied − 40 demanded = surplus of 40. Sellers will cut the price toward equilibrium."
        }
      },
      {
        num: "3.2",
        title: "Shifts in demand and supply",
        idea: "Anything other than the good's own price shifts a whole curve.",
        points: [
          ["Demand shifters", "Tastes, population (number and makeup of buyers), income, prices of related goods, and expectations about the future. Mnemonic: TRIBE (Tastes, Related goods, Income, Buyers, Expectations)."],
          ["Normal vs inferior goods", "Normal: income up, demand up. Inferior: income up, demand down (bus rides, store-brand ramen)."],
          ["Substitutes", "Price of a substitute rises, demand for this good rises. Coke price up → Pepsi demand up."],
          ["Complements", "Price of a complement rises, demand for this good falls. Hot dog buns price up → hot dog demand down."],
          ["Supply shifters", "Natural conditions (weather, disasters), input prices, technology, and government policy (taxes, subsidies, regulations)."],
          ["Direction", "Increase = shift right. Decrease = shift left. A higher input price or a new tax shifts supply left."]
        ],
        example: "A drought in California raises the cost of growing almonds. That's a supply shifter (natural conditions), so almond supply shifts left.",
        trap: "\"Price of the good itself\" is never on the shifter list. If the question changes the good's own price, the answer is a movement along the curve.",
        check: {
          prompt: "The price of hot dog buns rises. What happens in the hot dog market?",
          options: ["Demand for hot dogs shifts right", "Demand for hot dogs shifts left", "Supply of hot dogs shifts left", "Movement along the hot dog demand curve"],
          correct: 1,
          explain: "Buns and hot dogs are complements. A pricier complement makes hot dogs less attractive, so demand shifts left."
        }
      },
      {
        num: "3.3",
        title: "The four-step process",
        idea: "OpenStax's method for any \"what happens to price and quantity\" question.",
        points: [
          ["Step 1", "Draw the demand and supply curves before the change. Mark the original equilibrium."],
          ["Step 2", "Decide whether the event affects demand or supply. Use the shifter lists."],
          ["Step 3", "Decide which direction the curve shifts. Increase = right, decrease = left."],
          ["Step 4", "Find the new equilibrium and compare price and quantity with the original."],
          ["Both curves shift", "When both move, one of price or quantity is certain and the other depends on which shift is bigger."]
        ],
        example: "New espresso machines make coffee cheaper to produce. Step 2: supply. Step 3: right. Step 4: price falls, quantity rises.",
        trap: "Don't shift both curves for one event. A change in price caused by a demand shift does not also shift supply.",
        check: {
          prompt: "Demand shifts right and supply stays the same. The new equilibrium has:",
          options: ["Lower price, lower quantity", "Higher price, higher quantity", "Higher price, lower quantity", "No change"],
          correct: 1,
          explain: "More buyers at every price push the intersection up and to the right."
        }
      },
      {
        num: "3.4",
        title: "Price ceilings and price floors",
        idea: "Government sometimes sets a legal maximum or minimum price. It only matters if it stops the market from reaching equilibrium.",
        points: [
          ["Price ceiling", "A legal maximum price. Rent control is the standard example."],
          ["Binding ceiling", "Set below equilibrium. Quantity demanded exceeds quantity supplied, so there is a shortage."],
          ["Price floor", "A legal minimum price. The minimum wage and agricultural price supports are examples."],
          ["Binding floor", "Set above equilibrium. Quantity supplied exceeds quantity demanded, so there is a surplus."],
          ["Non-binding", "A ceiling above equilibrium or a floor below it changes nothing."]
        ],
        example: "If a city caps rent at $900 when the market rate is $1,200, more people want apartments and fewer landlords offer them. Waiting lists grow.",
        trap: "Ceilings sit below equilibrium to matter, floors above. Picture the ceiling of a room pressing down and the floor pushing up.",
        check: {
          prompt: "A price floor set above the equilibrium price creates:",
          options: ["A shortage", "A surplus", "Equilibrium", "No effect"],
          correct: 1,
          explain: "At the higher legal price, sellers offer more than buyers want."
        }
      },
      {
        num: "3.5",
        title: "Demand, supply and efficiency",
        idea: "At equilibrium, the total gain to buyers and sellers is as large as it can be.",
        points: [
          ["Consumer surplus", "The extra value buyers get: what they were willing to pay minus what they paid. Area below demand, above price."],
          ["Producer surplus", "The extra value sellers get: the price received minus the lowest price they would have accepted. Area above supply, below price."],
          ["Social surplus", "Consumer surplus + producer surplus. Largest at equilibrium."],
          ["Deadweight loss", "Social surplus lost when trades that would have helped both sides do not happen, for example under a binding price control."]
        ],
        example: "You'd pay $8 for a burrito and it costs $5. You get $3 of consumer surplus. The shop would sell for $3, so it gets $2 of producer surplus.",
        trap: "A price ceiling can raise consumer surplus for the lucky buyers who still get the good, but total social surplus always falls.",
        check: {
          prompt: "Consumer surplus is:",
          options: ["Price received minus cost", "Willingness to pay minus price paid", "Quantity supplied minus quantity demanded", "Government tax revenue"],
          correct: 1,
          explain: "It is the value buyers get above what they pay. On the graph, the triangle under demand and above the price."
        }
      }
    ],
    labs: ["market", "priceControl"],
    cards: [
      ["Demand vs quantity demanded", "Demand = the whole curve. Quantity demanded = one point at one price."],
      ["Law of demand", "Price up, quantity demanded down, ceteris paribus."],
      ["Law of supply", "Price up, quantity supplied up."],
      ["Demand shifters", "Tastes, Related goods' prices, Income, Buyers (population), Expectations. TRIBE."],
      ["Supply shifters", "Natural conditions, input prices, technology, government policy (taxes, subsidies, regulations)."],
      ["Normal vs inferior", "Normal: income up → demand up. Inferior: income up → demand down."],
      ["Substitutes vs complements", "Substitute price up → demand up. Complement price up → demand down."],
      ["Equilibrium", "Quantity demanded = quantity supplied. The market clears."],
      ["Surplus", "Price above equilibrium. Qs > Qd. Pressure for price to fall."],
      ["Shortage", "Price below equilibrium. Qd > Qs. Pressure for price to rise."],
      ["Four-step process", "1 Draw original. 2 Demand or supply? 3 Right or left? 4 Compare new equilibrium."],
      ["Binding ceiling / floor", "Ceiling below equilibrium → shortage. Floor above equilibrium → surplus."],
      ["Consumer surplus", "Willingness to pay minus price paid. Below demand, above price."],
      ["Producer surplus", "Price received minus minimum acceptable price. Above supply, below price."],
      ["Deadweight loss", "Lost social surplus from trades that don't happen."]
    ],
    questions: [
      { id: "c3-1", prompt: "The price of iced coffee rises from $4 to $5. On the iced coffee graph:", options: ["Demand shifts left", "Demand shifts right", "Movement along the demand curve. Quantity demanded falls", "Supply shifts left"], correct: 2, explain: "The good's own price changed, so you move along the curve. Only other factors shift it.", wrong: { 0: "This is the most common mistake in Ch 3. A change in the good's own price never shifts its own demand curve." } },
      { id: "c3-2", prompt: "Pizza and ranch are complements. The price of ranch rises. In the pizza market:", options: ["Demand for pizza shifts left", "Demand for pizza shifts right", "Supply of pizza shifts left", "Movement along pizza demand"], correct: 0, explain: "A pricier complement makes pizza less attractive at every price." },
      { id: "c3-3", prompt: "Baristas' wages rise. The supply of coffee drinks:", options: ["Shifts right", "Shifts left", "Doesn't shift. Wages affect demand", "Moves along the curve"], correct: 1, explain: "Wages are an input price. Higher input prices make each drink costlier to produce, so supply shifts left." },
      { id: "c3-4", prompt: "Income rises and ramen is an inferior good. What happens to ramen?", options: ["Demand shifts right", "Demand shifts left", "Supply shifts right", "Nothing"], correct: 1, explain: "Inferior good: more income, people switch to better options, so demand falls." },
      { id: "c3-5", prompt: "People expect PS5 prices to jump next month. Today's PS5 demand:", options: ["Shifts right", "Shifts left", "Is unchanged", "Becomes a supply shift"], correct: 0, explain: "Expectations are a demand shifter. Buy now before the price rises." },
      { id: "c3-6", prompt: "If the price is above equilibrium:", options: ["Shortage, price rises", "Surplus, price falls", "The market is in equilibrium", "Demand shifts"], correct: 1, explain: "Above equilibrium, Qs > Qd. Sellers cut prices to move unsold goods." },
      { id: "c3-7", prompt: "If Qd = 120 − 2P and Qs = 20 + 3P, the equilibrium price is:", options: ["$15", "$20", "$25", "$30"], correct: 1, explain: "Set 120 − 2P = 20 + 3P. Then 100 = 5P, so P = $20 and Q = 80." },
      { id: "c3-8", prompt: "Demand and supply both shift right. What do we know for sure?", options: ["Price rises", "Quantity rises. Price could go either way", "Price falls, quantity rises", "Both fall"], correct: 1, explain: "Both shifts push quantity up. They push price in opposite directions, so the price effect depends on which shift is bigger." },
      { id: "c3-9", prompt: "The government gives solar panel makers a subsidy. Solar panel supply:", options: ["Shifts right", "Shifts left", "Doesn't shift", "Moves along the curve"], correct: 0, explain: "A subsidy lowers producers' costs. It's a government-policy supply shifter, so supply shifts right." },
      { id: "c3-10", prompt: "A rent ceiling below the equilibrium rent creates:", options: ["A surplus of apartments", "A shortage of apartments", "No change", "Higher rents"], correct: 1, explain: "Binding ceiling: more people want apartments at the low rent than landlords offer." },
      { id: "c3-11", prompt: "A price ceiling set above the equilibrium price:", options: ["Creates a shortage", "Creates a surplus", "Has no effect", "Lowers the price"], correct: 2, explain: "The market price is already below the ceiling, so the ceiling doesn't bind." },
      { id: "c3-12", prompt: "You would pay $8 for a burrito that costs $5. Your consumer surplus is:", options: ["$13", "$8", "$5", "$3"], correct: 3, explain: "Willingness to pay ($8) minus price paid ($5) = $3." },
      { id: "c3-13", prompt: "A binding price floor causes deadweight loss because:", options: ["Prices fall", "Some trades that would benefit both sides no longer happen", "Producers get more surplus", "Demand shifts"], correct: 1, explain: "Fewer units trade than at equilibrium. The value of those lost trades is deadweight loss." },
      { id: "c3-14", prompt: "In step 2 of the four-step process you decide:", options: ["Whether the event affects demand or supply", "The new equilibrium price", "Which direction the curve shifts", "Whether to draw the graph"], correct: 0, explain: "1 Draw. 2 Demand or supply? 3 Which direction? 4 Compare the new equilibrium." }
    ]
  },

  /* ------------------------------------------------------------------ CH 4 */
  {
    id: "ch4",
    num: 4,
    title: "Labor and Financial Markets",
    short: "Labor and Financial Markets",
    sub: "Wages, interest rates, information",
    bigIdea: "The Chapter 3 model works anywhere there are buyers and sellers. In labor markets the price is the wage. In financial markets the price is the interest rate.",
    sections: [
      {
        num: "4.1",
        title: "Demand and supply at work in labor markets",
        idea: "Employers demand labor and workers supply it. The wage is the price.",
        points: [
          ["Who's who", "Firms are the buyers (demand), workers are the sellers (supply). It's the reverse of the goods market."],
          ["The book's example", "Nurses in Minneapolis–St. Paul–Bloomington: equilibrium wage $85,000 a year, 41,000 nurses employed."],
          ["Labor demand shifters", "Demand for the output, education and training, technology (a complement raises demand, a substitute lowers it), number of companies, government regulations, price and availability of other inputs."],
          ["Derived demand", "Firms want workers because customers want what the workers make. More demand for health care means more demand for nurses."],
          ["Labor supply shifters", "Number of workers (population, immigration, retirement), required education, and government policies."],
          ["Minimum wage / living wage", "A price floor in the labor market. If set above equilibrium, more people want jobs than firms want to hire: unemployment."]
        ],
        example: "In the book's living wage example, a $12/hour wage above equilibrium means 1,600 people want jobs but only 700 are hired.",
        trap: "In the labor market, workers are on the supply side. A surplus of labor is unemployment.",
        check: {
          prompt: "An aging population needs more health care. In the market for nurses:",
          options: ["Supply of nurses shifts right", "Demand for nurses shifts right", "Demand for nurses shifts left", "Wages fall"],
          correct: 1,
          explain: "Demand for the output (health care) rises, so demand for the labor that produces it rises too."
        }
      },
      {
        num: "4.2",
        title: "Demand and supply in financial markets",
        idea: "Savers supply money, borrowers demand it. The interest rate is the price of using someone else's money for a while.",
        points: [
          ["Supply of financial capital", "Savers and investors: households putting money in banks, buying bonds or stocks."],
          ["Demand for financial capital", "Borrowers: households buying homes and cars or using credit cards, firms investing, governments."],
          ["The book's example", "U.S. credit cards: equilibrium near 15% interest and $600 billion borrowed. At 21% there's a surplus of loanable funds. At 13% there's a shortage."],
          ["What shifts them", "Supply moves with income, saving for retirement, and confidence that loans will be repaid. Demand moves with business and consumer confidence: up in the 1990s tech boom, down in the 2008 recession."],
          ["Usury laws", "An interest-rate ceiling. If binding (below equilibrium), some willing borrowers can't get credit. Most state limits sit well above market rates, so they don't bind."]
        ],
        example: "If more people save for retirement, the supply of financial capital shifts right. Interest rates fall and more lending happens.",
        trap: "Savers are suppliers. A higher interest rate raises the quantity supplied of savings and lowers the quantity demanded of loans.",
        check: {
          prompt: "Businesses become optimistic and want to build new factories. In the market for financial capital:",
          options: ["Supply shifts right, rates fall", "Demand shifts right, rates rise", "Demand shifts left, rates fall", "Nothing changes"],
          correct: 1,
          explain: "Firms are borrowers. More borrowing at every rate shifts demand right and pushes the interest rate up."
        }
      },
      {
        num: "4.3",
        title: "The market system as an efficient mechanism for information",
        idea: "A price packs millions of people's information into one number.",
        points: [
          ["Prices as signals", "A rising price tells producers to make more and buyers to economize, with no one in charge."],
          ["Why price controls backfire", "No planner can gather what millions of buyers and sellers know. The book's example: during China's Great Leap Forward, food prices were held artificially low, farmers produced less, and widespread starvation followed."],
          ["Markets aren't perfect", "Prices can't handle every problem. Later chapters cover pollution, public goods and inequality, where government plays a role."]
        ],
        example: "From the book: when oat prices rise, farmers plant more oats without needing to know why demand went up. When holiday plane tickets jump, travelers shift their dates.",
        trap: "\"Efficient\" here means good at using information. It does not mean the outcome is fair.",
        check: {
          prompt: "Why do market prices carry information well?",
          options: ["The government sets them carefully", "They combine the decisions of many buyers and sellers", "They never change", "They are always fair"],
          correct: 1,
          explain: "Each buyer and seller acts on what they know. The price reflects all of it at once."
        }
      }
    ],
    labs: ["laborMarket", "minWage", "financeMarket", "usury", "pdv"],
    cards: [
      ["Labor market roles", "Firms demand labor. Workers supply labor. Price = wage."],
      ["Derived demand", "Demand for labor comes from demand for the goods and services workers produce."],
      ["Labor demand shifters", "Demand for output, education and training, technology, number of companies, regulations, price of other inputs."],
      ["Technology and labor", "A complement to workers raises labor demand. A substitute for workers lowers it."],
      ["Labor supply shifters", "Number of workers, required education, government policies."],
      ["Minimum wage", "A price floor. If above equilibrium, surplus of labor = unemployment."],
      ["Financial market roles", "Savers supply financial capital. Borrowers demand it. Price = interest rate."],
      ["Credit card example", "Equilibrium about 15% and $600 billion. Above it, surplus of lending. Below it, shortage."],
      ["Usury law", "Interest rate ceiling. If binding, a shortage of credit."],
      ["Prices as information", "Prices combine the knowledge of millions of buyers and sellers into one signal."]
    ],
    questions: [
      { id: "c4-1", prompt: "In the labor market, who supplies labor?", options: ["Firms", "Workers", "Government", "Consumers of the output"], correct: 1, explain: "Workers sell their time. Firms buy it." },
      { id: "c4-2", prompt: "Demand for labor is called derived demand because:", options: ["Workers want jobs", "It comes from demand for the goods workers produce", "Wages determine it", "It is set by unions"], correct: 1, explain: "No demand for coffee means no demand for baristas." },
      { id: "c4-3", prompt: "Hospitals adopt software that does work nurses used to do by hand. If it substitutes for nurses, demand for nurses:", options: ["Shifts right", "Shifts left", "Doesn't change", "Becomes supply"], correct: 1, explain: "Technology that substitutes for labor lowers labor demand. Technology that complements labor raises it." },
      { id: "c4-4", prompt: "A state adds a new licensing exam required to work as a nurse. Supply of nurses:", options: ["Shifts right", "Shifts left", "Doesn't change", "Demand shifts right"], correct: 1, explain: "Required education is a labor supply shifter. Harder entry means fewer qualified workers." },
      { id: "c4-5", prompt: "A minimum wage set above the equilibrium wage leads to:", options: ["A shortage of workers", "More people wanting jobs than firms hire", "No effect", "Lower wages"], correct: 1, explain: "It's a binding price floor. Quantity of labor supplied exceeds quantity demanded: unemployment." },
      { id: "c4-6", prompt: "In the financial capital market, the \"price\" is:", options: ["The stock price", "The interest rate", "The wage", "Inflation"], correct: 1, explain: "The interest rate is what borrowers pay and savers receive." },
      { id: "c4-7", prompt: "Who demands financial capital?", options: ["Savers", "Borrowers like home buyers, firms and governments", "Only banks", "Only foreign investors"], correct: 1, explain: "Borrowers want funds now and pay interest for them." },
      { id: "c4-8", prompt: "Credit card rates are at 21% but equilibrium is 15%. There is:", options: ["A shortage of credit", "A surplus of lending. Lenders offer more than people borrow", "Equilibrium", "A usury law violation"], correct: 1, explain: "Above equilibrium: quantity supplied (≈$750B) exceeds quantity demanded (≈$480B) in the book's example." },
      { id: "c4-9", prompt: "Most U.S. state usury laws:", options: ["Cause big shortages of credit", "Are set well above market rates, so they don't bind", "Set rates below 5%", "Act as price floors"], correct: 1, explain: "OpenStax notes most usury ceilings sit far above market rates, so they rarely matter." },
      { id: "c4-10", prompt: "During the 2008 recession, firms' demand for financial capital:", options: ["Rose", "Fell", "Stayed the same", "Became supply"], correct: 1, explain: "Less business confidence means fewer investment projects, so demand for borrowing shifts left." },
      { id: "c4-11", prompt: "Section 4.3 argues markets are efficient at:", options: ["Making outcomes fair", "Processing information through prices", "Eliminating scarcity", "Avoiding all shortages"], correct: 1, explain: "Prices combine scattered knowledge. Fairness is a separate question." }
    ]
  },

  /* ------------------------------------------------------------------ CH 5 */
  {
    id: "ch5",
    num: 5,
    title: "Elasticity",
    short: "Elasticity",
    sub: "How strongly quantity responds",
    bigIdea: "Elasticity tells you how strongly quantity reacts when price, income or another price changes. It decides whether a price increase brings in more revenue or less.",
    sections: [
      {
        num: "5.1",
        title: "Price elasticity of demand and supply",
        idea: "Elasticity = percent change in quantity ÷ percent change in price.",
        points: [
          ["Price elasticity of demand", "%Δ quantity demanded ÷ %Δ price. Reported as an absolute value."],
          ["Midpoint method", "Divide each change by the average of the old and new values. You get the same answer whether price goes up or down."],
          ["Elastic", "Greater than 1. Quantity reacts more than price."],
          ["Inelastic", "Less than 1. Quantity reacts less than price."],
          ["Unit elastic", "Exactly 1. Same percentage change."],
          ["Price elasticity of supply", "%Δ quantity supplied ÷ %Δ price."]
        ],
        example: "The book's example: price rises from $60 to $70 and quantity falls from 3,000 to 2,800. %ΔQ = −200 ÷ 2,900 = −6.9%. %ΔP = 10 ÷ 65 = 15.4%. Elasticity ≈ 0.45, inelastic.",
        trap: "Elasticity is not the slope. A straight-line demand curve has the same slope everywhere but a different elasticity at every point.",
        formula: "Ed = [(Q₂ − Q₁) ÷ ((Q₁ + Q₂)/2)] ÷ [(P₂ − P₁) ÷ ((P₁ + P₂)/2)]",
        check: {
          prompt: "An elasticity of demand of 1.5 means:",
          options: ["A 1% price rise cuts quantity demanded by 1.5%", "Demand is inelastic", "Price and quantity rise together", "Demand is unit elastic"],
          correct: 0,
          explain: "Greater than 1 = elastic. Quantity reacts one and a half times as strongly as price."
        }
      },
      {
        num: "5.2",
        title: "Polar cases of elasticity and constant elasticity",
        idea: "The extremes help you picture everything in between.",
        points: [
          ["Perfectly inelastic (0)", "Vertical curve. Quantity doesn't change at all when price changes."],
          ["Perfectly elastic (∞)", "Horizontal curve. Any price increase drops quantity to zero."],
          ["Constant unitary elasticity", "A curved demand curve where every point has elasticity 1, so total revenue never changes."]
        ],
        example: "Life-saving medicine with no substitute comes close to perfectly inelastic. One farmer's wheat in a world market comes close to perfectly elastic.",
        trap: "Steep does not mean inelastic everywhere. Only a vertical line is inelastic at every point.",
        check: {
          prompt: "A perfectly elastic demand curve is:",
          options: ["Vertical", "Horizontal", "Upward sloping", "A straight diagonal line"],
          correct: 1,
          explain: "Horizontal. Buyers take any amount at that price and none at a higher one."
        }
      },
      {
        num: "5.3",
        title: "Elasticity and pricing",
        idea: "Whether raising the price helps revenue depends on elasticity.",
        points: [
          ["Total revenue", "Price × quantity."],
          ["Elastic demand", "Raise price → revenue falls. Lose too many buyers."],
          ["Inelastic demand", "Raise price → revenue rises. Buyers mostly stay."],
          ["Passing on costs", "Firms can pass higher costs to customers more easily when demand is inelastic."],
          ["Tax incidence", "The side of the market that is less elastic bears more of a tax."],
          ["Long run vs short run", "Demand and supply are usually more elastic in the long run because people have time to adjust."]
        ],
        example: "Gas demand is inelastic in the short run: you still have to get to class. Over years, people buy hybrids or move closer, so demand becomes more elastic.",
        trap: "Inelastic does not mean buyers don't care about price. It means their quantity responds less than the price does.",
        check: {
          prompt: "Demand is elastic and a firm raises its price. Total revenue:",
          options: ["Rises", "Falls", "Doesn't change", "Can't tell"],
          correct: 1,
          explain: "The percentage drop in quantity is bigger than the percentage rise in price."
        }
      },
      {
        num: "5.4",
        title: "Elasticity in areas other than price",
        idea: "The same idea measures responses to income, other prices, wages and interest rates.",
        points: [
          ["Income elasticity", "%Δ quantity demanded ÷ %Δ income. Positive = normal good. Negative = inferior good."],
          ["Cross-price elasticity", "%Δ quantity of good A ÷ %Δ price of good B. Positive = substitutes. Negative = complements."],
          ["Elasticity of labor supply", "%Δ hours worked ÷ %Δ wage."],
          ["Elasticity of savings", "%Δ savings ÷ %Δ interest rate."]
        ],
        example: "If Uber prices rise 10% and Lyft rides rise 6%, the cross-price elasticity is +0.6. They're substitutes.",
        trap: "For income and cross-price elasticity, the sign matters. Don't drop it the way you do for price elasticity.",
        check: {
          prompt: "Cross-price elasticity between peanut butter and jelly is negative. They are:",
          options: ["Substitutes", "Complements", "Unrelated", "Inferior goods"],
          correct: 1,
          explain: "Jelly's price up, peanut butter quantity down. They're used together."
        }
      }
    ],
    labs: ["elasticityCalc", "revenueCurve", "polar"],
    cards: [
      ["Price elasticity of demand", "%ΔQd ÷ %ΔP (midpoint). >1 elastic, <1 inelastic, =1 unit elastic."],
      ["Midpoint method", "Divide each change by the average of old and new. Same answer in both directions."],
      ["Elastic determinants", "Many substitutes, luxury, long run, large share of budget → more elastic."],
      ["Total revenue test", "Elastic: P up → TR down. Inelastic: P up → TR up. Unit: TR unchanged."],
      ["Perfectly inelastic", "Vertical. Elasticity 0."],
      ["Perfectly elastic", "Horizontal. Elasticity infinite."],
      ["Tax incidence", "The less elastic side of the market bears more of the tax."],
      ["Income elasticity", "%ΔQ ÷ %ΔIncome. Positive normal, negative inferior."],
      ["Cross-price elasticity", "%ΔQa ÷ %ΔPb. Positive substitutes, negative complements."],
      ["Price elasticity of supply", "%ΔQs ÷ %ΔP. Usually larger in the long run."]
    ],
    questions: [
      { id: "c5-1", prompt: "Why does OpenStax use the midpoint method?", options: ["It's easier to calculate", "It gives the same elasticity whether price rises or falls", "It equals the slope", "It always gives 1"], correct: 1, explain: "Dividing by the average avoids getting different answers depending on the starting point." },
      { id: "c5-2", prompt: "If elasticity of demand is 1.5, demand is:", options: ["Inelastic", "Elastic", "Unit elastic", "Perfectly inelastic"], correct: 1, explain: "Greater than 1 means elastic." },
      { id: "c5-3", prompt: "Demand is elastic and price rises. Total revenue:", options: ["Rises", "Falls", "Stays the same", "Becomes zero"], correct: 1, explain: "The quantity drop outweighs the price rise." },
      { id: "c5-4", prompt: "Which makes demand more elastic?", options: ["Few substitutes", "A necessity", "Many substitutes and more time to adjust", "A tiny share of the budget"], correct: 2, explain: "More substitutes, luxuries, a longer time frame and a bigger budget share all raise elasticity." },
      { id: "c5-5", prompt: "A perfectly inelastic demand curve is:", options: ["Horizontal", "Vertical", "Unit elastic", "Upward sloping"], correct: 1, explain: "Vertical: the same quantity at every price. Elasticity is 0." },
      { id: "c5-6", prompt: "Income rises 10% and quantity demanded rises 5%. The good is:", options: ["Inferior", "Normal, with income elasticity 0.5", "Normal, with income elasticity 2", "A complement"], correct: 1, explain: "5% ÷ 10% = 0.5. Positive means normal." },
      { id: "c5-7", prompt: "Cross-price elasticity is negative. The goods are:", options: ["Substitutes", "Complements", "Unrelated", "Inferior"], correct: 1, explain: "Price of one up, quantity of the other down. They go together." },
      { id: "c5-8", prompt: "Price rises 10% and quantity supplied rises 5%. Elasticity of supply is:", options: ["2", "0.5", "1", "0"], correct: 1, explain: "5% ÷ 10% = 0.5. Inelastic supply." },
      { id: "c5-9", prompt: "Which likely has the most elastic demand?", options: ["Gasoline next week", "A specific streaming service", "Insulin", "Salt"], correct: 1, explain: "One streaming service has many close substitutes and is not a necessity." },
      { id: "c5-10", prompt: "If demand is much less elastic than supply, a tax falls mostly on:", options: ["Sellers", "Buyers", "Both equally", "Government"], correct: 1, explain: "The less elastic side can't easily walk away, so it bears more of the tax." },
      { id: "c5-11", prompt: "Price goes from $10 to $12 and quantity from 100 to 80. Using the midpoint method, elasticity is about:", options: ["0.82", "1.0", "1.22", "2.0"], correct: 2, explain: "%ΔQ = −20 ÷ 90 = −22.2%. %ΔP = 2 ÷ 11 = 18.2%. 22.2 ÷ 18.2 ≈ 1.22, elastic." }
    ]
  }
];

/* Diagnostic: two quick questions per chapter, scored per chapter. */
MM.diagnostic = [
  { id: "d1", chapter: "ch1", prompt: "Scarcity means:", options: ["Resources are unlimited", "Human wants exceed the resources available", "Only poor people face trade-offs", "Prices are high"], correct: 1, explain: "Scarcity is the starting point of economics: wants are bigger than resources." },
  { id: "d2", chapter: "ch1", prompt: "\"How a coffee shop decides how many baristas to hire\" is:", options: ["Microeconomics", "Macroeconomics", "Monetary policy", "Fiscal policy"], correct: 0, explain: "One firm's decision is micro." },
  { id: "d3", chapter: "ch2", prompt: "You have 3 free hours. Tutoring pays $25/hr. Studying for an exam is worth $30/hr to you. You watch Netflix instead. The opportunity cost is:", options: ["$0", "$75 of tutoring", "$90 of studying, your next best option", "$165, everything combined"], correct: 2, explain: "Opportunity cost is the single next best alternative: 3 × $30 = $90." },
  { id: "d4", chapter: "ch2", prompt: "A point inside the PPF is:", options: ["Unattainable", "Attainable but inefficient", "Allocatively efficient", "Proof of growth"], correct: 1, explain: "Inside means resources are idle or wasted. You could have more of both." },
  { id: "d5", chapter: "ch3", prompt: "Tastes shift toward oat milk lattes. In that market:", options: ["Supply shifts right", "Quantity supplied rises only", "Demand shifts right", "Price must fall"], correct: 2, explain: "Tastes are a demand shifter. More wanted at every price." },
  { id: "d6", chapter: "ch3", prompt: "The price of the good itself rises. On its demand curve this is:", options: ["A shift left", "A shift right", "A movement along the curve", "A supply shift"], correct: 2, explain: "Own price only moves you along the curve." },
  { id: "d7", chapter: "ch4", prompt: "In the labor market, demand comes from:", options: ["Workers", "Employers", "Unions", "Banks"], correct: 1, explain: "Firms buy labor. Workers supply it." },
  { id: "d8", chapter: "ch4", prompt: "In the market for financial capital, savers are:", options: ["Demanders", "Suppliers", "Regulators", "Not part of it"], correct: 1, explain: "Savers supply funds. Borrowers demand them. The interest rate is the price." },
  { id: "d9", chapter: "ch5", prompt: "Demand is inelastic and a store raises its price. Revenue:", options: ["Falls", "Rises", "Stays the same", "Drops to zero"], correct: 1, explain: "Quantity falls by a smaller percentage than price rises, so revenue goes up." },
  { id: "d10", chapter: "ch5", prompt: "Elasticity of demand measures:", options: ["The slope of demand", "How strongly quantity demanded responds to price", "How fast prices change", "Total revenue"], correct: 1, explain: "Percent change in quantity divided by percent change in price." }
];

MM.formulas = [
  ["Opportunity cost", "Give up ÷ Get"],
  ["Budget slope", "−(P on horizontal ÷ P on vertical)"],
  ["Equilibrium", "Qd = Qs"],
  ["Surplus / shortage", "Qs − Qd at the given price"],
  ["Consumer surplus", "½ × base × height under demand, above price"],
  ["Elasticity", "%ΔQ ÷ %ΔP (midpoint)"],
  ["Total revenue", "P × Q"],
  ["Income elasticity", "%ΔQ ÷ %ΔIncome"],
  ["Cross-price", "%ΔQa ÷ %ΔPb"]
];
