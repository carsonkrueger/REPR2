const exerciseNames: string[] = [
  "Arnold Press (Dumbbell)",
  "Around the World",
  "Back Extension",
  "Back Extension (Machine)",
  "Ball Slams",
  "Battle Ropes",
  "Bench Dip",
  "Bench Press (Barbell)",
  "Bench Press (Cable)",
  "Bench Press (Dumbbell)",
  "Bench Press (Smith Machine)",
  "Bench Press Close Grip (Barbell)",
  "Bench Press Wide Grip (Barbell)",
  "Bent Over One Arm Row (Dumbbell)",
  "Bent Over Row (Band)",
  "Bent Over Row (Barbell)",
  "Bent Over Row Underhand (Barbell)",
  "Bicep Curl (Barbell)",
  "Bicep Curl (Cable)",
  "Bicep Curl (Dumbbell)",
  "Bicep Curl (Machine)",
  "Bicycle Crunch",
  "Box Jump",
  "Box Squat (Barbell)",
  "Bulgarian Split Squat",
  "Burpee",
  "Cable Crossover",
  "Cable Crunch",
  "Cable Kickback",
  "Cable Pull Through",
  "Cable Twist",
  "Calf Press on Leg Press",
  "Calf Press on Seated Leg Press",
  "Chest Dip",
  "Chest Dip (Assisted)",
  "Chest Fly",
  "Chest Fly (Band)",
  "Chest Fly (Dumbbell)",
  "Chest Press (Band)",
  "Chest Press (Machine)",
  "Chin Up",
  "Chin Up (Assisted)",
  "Clean (Barbell)",
  "Clean and Jerk (Barbell)",
  "Concentration Curl (Dumbbell)",
  "Cross Body Crunch",
  "Crunch",
  "Crunch (Machine)",
  "Crunch (Stability Ball)",
  "Cycling",
  "Climbing",
  "Deadlift (Band)",
  "Deadlift (Barbell)",
  "Deadlift (Dumbbell)",
  "Deadlift (Smith Machine)",
  "Deadlift High Pull (Barbell)",
  "Decline Bench Press (Barbell)",
  "Decline Bench Press (Dumbbell)",
  "Decline Bench Press (Smith Machine)",
  "Decline Crunch",
  "Deficit Deadlift (Barbell)",
  "Elliptical Machine",
  "Face Pull (Cable)",
  "Flat Knee Raise",
  "Flat leg Raise",
  "Floor Press (Barbell)",
  "Front Raise (Band)",
  "Front Raise (Barbell)",
  "Front Raise (Cable)",
  "Front Raise (Dumbbell)",
  "Front Raise (Plate)",
  "Front Squat (Barbell)",
  "Glute Ham Raise",
  "Glute Kickback (Machine)",
  "Goblet Squat (Kettlebell)",
  "Good Morning (Barbell)",
  "Hack Squat",
  "Hack Squat (Barbell)",
  "Hammer Curl (Band)",
  "Hammer Curl (Cable)",
  "Hammer Curl (Dumbbell)",
  "Handstand Push Up",
  "Hang Clean (Barbell)",
  "Hang Snatch (Barbell)",
  "Hanging Knee Raise",
  "Hanging Leg Raise",
  "High Knee Skips",
  "Hip Abductor (Machine)",
  "Hip Adductor (Machine)",
  "Hip Thrust (Barbell)",
  "Hip Thrust (Bodyweight)",
  "Incline Bench Press (Barbell)",
  "Incline Bench Press (Cable)",
  "Incline Bench Press (Dumbbell)",
  "Incline Bench Press (Smith Machine)",
  "Incline Chest Fly (Dumbbell)",
  "Incline Chest Press (Machine)",
  "Incline Curl (Dumbbell)",
  "Incline Row (Dumbbell)",
  "Inverted Row (Bodyweight)",
  "Iso-Lateral Chest Press (Machine)",
  "Jackknife Sit Up",
  "Jump Rope",
  "Jump Shrug (Barbell)",
  "Jump Squat",
  "jumping Jack",
  "Kettlebell Swing",
  "Kettlebell Turkish Get Up",
  "Kipping Pull Up",
  "Knee Raise (Captain's Chair)",
  "Kneeling Pulldown (Band)",
  "Knees to Elbows",
  "Lat Pulldown (Cable)",
  "Lat Pulldown (Machine)",
  "Lat Pulldown (Single Arm)",
  "Lat Pulldown Underhand (Band)",
  "Lat Pulldown Underhand (Cable)",
  "Lat Pulldown Wide Grip (Cable)",
  "Lateral Box Jump",
  "Lateral Raise (Band)",
  "Lateral Raise (Cable)",
  "Lateral Raise (Dumbbell)",
  "Lateral Raise (Machine)",
  "Leg Extension (Machine)",
  "Leg Press",
  "Lunge (Barbell)",
  "Lunge (Bodyweight)",
  "Lunge (Dumbbell)",
  "Lying Leg Curl (Machine)",
  "Mountain Climber",
  "Muscle Up",
  "Oblique Crunch",
  "Overhead Press (Barbell)",
  "Overhead Press (Cable)",
  "Overhead Press (Dumbbell)",
  "Overhead Press (Smith Machine)",
  "Overhead Press (Barbell)",
  "Overhead Squat (Barbell)",
  "Pec Deck (Machine)",
  "Pendlay Row (Barbell)",
  "Pistol Squat",
  "Plank",
  "Power Clean",
  "Power Snatch (Barbell)",
  "Preacher Curl (Barbell)",
  "Preacher Curl (Dumbbell)",
  "Preacher Curl (Machine)",
  "Press Under (Barbell)",
  "Pull Up",
  "Pull Up (Assisted)",
  "Pull Up (Band)",
  "Pullover (Dumbbell)",
  "Pullover (Machine)",
  "Push Press",
  "Push Up",
  "Push Up (Band)",
  "Push Up (Knees)",
  "Rack Pull (Barbell)",
  "Reverse Crunch",
  "Reverse Curl (Band)",
  "Reverse Curl (Barbell)",
  "Reverse Curl (Dumbbell)",
  "Reverse Fly (Dumbbell)",
  "Reverse Fly (Cable)",
  "Reverse Fly (Machine)",
  "Reverse Grip Concentration Curl",
  "Reverse Plank",
  "Romanian Deadlift (Barbell)",
  "Romanian Deadlift (Dumbbell)",
  "Rowing (Machine)",
  "Running",
  "Running (Treadmill)",
  "Russian Twist",
  "Seated Calf Raise (Machine)",
  "Seated Calf Raise (Plate Loaded)",
  "Seated Leg Curl (Machine)",
  "Seated Leg Press (Machine)",
  "Seated Overhead Press (Barbell)",
  "Seated Overhead Press (Dumbbell)",
  "Seated Palms Up Wrist Curl (Dumbbell)",
  "Seated Row (Cable)",
  "Seated Row (Machine)",
  "Seated Wide-Grip Row (Cable)",
  "Shoulder Press (Machine)",
  "Shoulder Press (Plate Loaded)",
  "Shrug (Barbell)",
  "Shrug (Dumbbell)",
  "Shrug (Machine)",
  "Shrug (Smith Machine)",
  "Side Bend (Band)",
  "Side Bend (Cable)",
  "Side Bend (Dumbbell)",
  "Side Plank",
  "Single Leg Bridge",
  "Sit Up",
  "Skullcrusher (Barbell)",
  "Skullcrusher (Dumbbell)",
  "Snatch (Barbell)",
  "Snatch Pull (Barbell)",
  "Split Jerk (Barbell)",
  "Squat (Band)",
  "Squat (Barbell)",
  "Squat (Bodyweight)",
  "Squat (Dumbbell)",
  "Squat (Machine)",
  "Squat (Smith Machine)",
  "Squat Row (Band)",
  "Standing Calf Raise (Barbell)",
  "Standing Calf Raise (Bodyweight)",
  "Standing Calf Raise (Dumbbell)",
  "Standing Calf Raise (Machine)",
  "Standing Calf Raise (Smith Machine)",
  "Step Up",
  "Stiff Leg Deadlift (Barbell)",
  "Stiff Leg Deadlift (Dumbbell)",
  "Straight leg Deadlift (Band)",
  "Streching",
  "Strict Military Press (Barbell)",
  "Sumo Deadlift",
  "Sumo Deadlift High Pull (Barbell)",
  "Superman",
  "Swimming",
  "T Bar Row",
  "Thruster (Barbell)",
  "Thruster (Kettlebell)",
  "Toes to Bar",
  "Torso Rotation (Machine)",
  "Trap Bar Deadlift",
  "Triceps Dip",
  "Triceps Dip (Assisted)",
  "Triceps Extension",
  "Triceps Extension (Barbell)",
  "Triceps Extension (Cable)",
  "Triceps Extension (Dumbbell)",
  "Triceps Extension (Machine)",
  "Triceps Pushdown (Cable)",
  "Upright Row (Babell)",
  "Upright Row (Cable)",
  "Upright Row (Dumbbell)",
  "V Up",
  "Walking",
  "Wide Pull Up",
  "Wrist Roller",
  "Yoga",
  "Zercher Squat Barbell",
];

export default exerciseNames;
