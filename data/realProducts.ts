// data/realProducts.ts
import { v4 as uuidv4 } from 'uuid';

export const realProducts = [
  // REFRIGERATOR PRODUCTS
  {
    id: uuidv4(),
    partNumber: "W10295370A",
    name: "EveryDrop Refrigerator Water Filter 1",
    description: "Certified to reduce 28 contaminants including lead, pesticides, pharmaceuticals, and waterborne parasites. Genuine Whirlpool replacement filter.",
    price: 49.99,
    originalPrice: 54.99,
    discount: 9,
    category: "refrigerator",
    subcategory: "filters",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?refrigerator+water+filter",
    inStock: true,
    stockCount: 122,
    rating: 4.7,
    reviewCount: 2841,
    compatibleModels: [
      "WRF535SMBM00", "WRS325FDAM04", "WRS325FDAM02", 
      "WRX735SDBM00", "WRF535SWHZ", "WRS571CIHZ"
    ],
    deliveryEstimate: "1-3 business days",
    specifications: {
      "dimensions": "2.5 x 2.5 x 8.5 inches",
      "filter_life": "6 months or 200 gallons",
      "filter_type": "Carbon",
      "certification": "NSF 42, 53, 401",
      "replaces_part": "W10295370, W10276924"
    },
    installationSteps: [
      "Turn off the refrigerator and unplug it from the power outlet.",
      "Locate the water filter housing in the refrigerator compartment (typically in the upper right corner).",
      "Twist the old filter counterclockwise and pull to remove.",
      "Remove the protective cap from the new filter.",
      "Insert the new filter into the housing and twist clockwise until it locks into place.",
      "Run 4 gallons of water through the dispenser to remove air and contaminants (about 5-7 minutes of dispensing).",
      "Reset the filter indicator light if your model has one (consult your manual for instructions)."
    ],
    troubleshootingTips: [
      "If water flow is reduced after installation, check that the filter is properly locked in place.",
      "If you notice black particles in the water after installation, flush the system with additional water.",
      "If the filter is difficult to install, check for proper alignment with the housing."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "WPW10730972",
    name: "Refrigerator Evaporator Fan Motor",
    description: "Replacement evaporator fan motor that circulates air over the refrigerator and freezer coils during the cooling cycle. Resolves noisy operation issues and improves cooling efficiency.",
    price: 65.49,
    originalPrice: 79.99,
    discount: 18,
    category: "refrigerator",
    subcategory: "fans and blowers",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?refrigerator+motor",
    inStock: true,
    stockCount: 34,
    rating: 4.8,
    reviewCount: 731,
    compatibleModels: [
      "LFSS2612TF0", "FGHS2631PF4A", "WRS325FDAM04", 
      "MFI2568AES", "WRF535SMBM00", "FGHC2331PFAA"
    ],
    deliveryEstimate: "2-3 business days",
    specifications: {
      "voltage": "115V",
      "rpm": "3000",
      "direction": "Clockwise",
      "mounting": "Bracket Mount",
      "replaces_part": "W10189703, WPW10189703"
    },
    installationSteps: [
      "Unplug refrigerator from electrical outlet.",
      "Remove all food from freezer section.",
      "Remove freezer shelf and back panel to access evaporator fan.",
      "Disconnect wire harness from old fan motor.",
      "Remove mounting screws and brackets holding the fan in place.",
      "Remove the fan blade from the old motor shaft.",
      "Install fan blade onto new motor.",
      "Mount new fan motor using existing brackets and screws.",
      "Reconnect wire harness to new fan motor.",
      "Reinstall back panel and freezer shelf.",
      "Restore power and verify fan operation."
    ],
    troubleshootingTips: [
      "If refrigerator is noisy after fan replacement, check that fan blade isn't contacting any surface.",
      "If refrigerator isn't cooling properly, ensure the fan is operating and air flow isn't blocked.",
      "If fan doesn't run, verify proper electrical connection and that freezer temperature is calling for cooling."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "DA97-07603B",
    name: "Samsung Refrigerator Ice Maker Assembly",
    description: "Complete ice maker assembly replacement for Samsung refrigerators. Resolves issues with ice maker not making ice or producing small/hollow cubes.",
    price: 119.99,
    originalPrice: 149.95,
    discount: 20,
    category: "refrigerator",
    subcategory: "ice makers",
    brand: "Samsung",
    imageUrl: "https://source.unsplash.com/300x300/?refrigerator+ice+maker",
    inStock: true,
    stockCount: 18,
    rating: 4.3,
    reviewCount: 1247,
    compatibleModels: [
      "RF28HFEDBSR", "RF263BEAESR", "RF24FSEDBSR", 
      "RF25HMEDBSR", "RF28HMEDBSR", "RF34H9950S4"
    ],
    deliveryEstimate: "2-4 business days",
    specifications: {
      "voltage": "115V",
      "ice_production": "3-4 lbs per day",
      "dimensions": "8.5 x 4.2 x 6.8 inches",
      "color": "White",
      "replaces_part": "DA97-07603A, DA97-05554A"
    },
    installationSteps: [
      "Unplug refrigerator from electrical outlet.",
      "Turn off water supply to refrigerator.",
      "Remove ice bucket and shelving to access ice maker.",
      "Disconnect water line from existing ice maker (have towel ready for water spillage).",
      "Remove mounting screws holding ice maker to freezer wall.",
      "Disconnect wire harness from refrigerator.",
      "Install new ice maker and secure with mounting screws.",
      "Connect wire harness to new ice maker.",
      "Reattach water line and ensure it's secure.",
      "Replace shelving and ice bucket.",
      "Restore water and power supply.",
      "Discard first few batches of ice after installation."
    ],
    troubleshootingTips: [
      "If ice maker doesn't produce ice, check water supply and ensure valve is fully open.",
      "If ice cubes are small or hollow, water pressure may be too low.",
      "If ice maker doesn't cycle, check for frozen water line or clogged water filter.",
      "If ice tastes bad, replace water filter and flush system by discarding several batches of ice."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "WR55X10942",
    name: "GE Refrigerator Water Inlet Valve",
    description: "Replacement water inlet valve that controls the flow of water to the ice maker and water dispenser. Fixes issues with water not dispensing or ice maker not filling.",
    price: 52.95,
    originalPrice: 64.99,
    discount: 19,
    category: "refrigerator",
    subcategory: "valves",
    brand: "GE",
    imageUrl: "https://source.unsplash.com/300x300/?refrigerator+valve",
    inStock: true,
    stockCount: 41,
    rating: 4.6,
    reviewCount: 703,
    compatibleModels: [
      "GSH25JSTASS", "GSL25JFPABS", "PSS26SGPASS", 
      "GFSS2HCYCSS", "PFS22SISBSS", "GSE25HMHES"
    ],
    deliveryEstimate: "2-4 business days",
    specifications: {
      "voltage": "120V",
      "connection_type": "Quick Connect",
      "inlet_size": "1/4 inch",
      "coil_resistance": "500-800 ohms",
      "replaces_part": "WR55X10942P, WR55X23290, WR55X10025"
    },
    installationSteps: [
      "Turn off water supply to refrigerator.",
      "Unplug refrigerator from electrical outlet.",
      "Pull refrigerator away from wall to access the water valve (usually at the bottom rear).",
      "Disconnect water line from valve (have towel ready for water spillage).",
      "Remove mounting screws or brackets holding valve in place.",
      "Disconnect electrical connections from old valve (take a picture first for reference).",
      "Install new valve in same position and secure with mounting hardware.",
      "Reconnect electrical connections to matching terminals.",
      "Reconnect water line to new valve and tighten securely.",
      "Turn on water supply and check for leaks.",
      "Plug in refrigerator and push back into position.",
      "Run water dispenser for several minutes to purge air from lines."
    ],
    troubleshootingTips: [
      "If water dispenser doesn't work after valve replacement, check electrical connections.",
      "If valve leaks after installation, ensure water line is properly seated and clamps are tight.",
      "If ice maker doesn't fill, verify water pressure is at least 20 PSI.",
      "Humming noise from valve area could indicate partial valve opening or low water pressure."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "W10309240",
    name: "Refrigerator Door Gasket",
    description: "Replacement door seal that prevents cold air from escaping the refrigerator. Addresses issues with door sweating, excessive frost, or temperature fluctuations.",
    price: 47.95,
    originalPrice: 59.99,
    discount: 20,
    category: "refrigerator",
    subcategory: "seals and gaskets",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?refrigerator+seal",
    inStock: true,
    stockCount: 64,
    rating: 4.5,
    reviewCount: 856,
    compatibleModels: [
      "WRF535SMBM00", "WRS325FDAM04", "MFI2568AES", 
      "LFSS2612TF0", "WRX735SDBM00", "FGHS2631PF4A"
    ],
    deliveryEstimate: "1-3 business days",
    specifications: {
      "color": "White",
      "material": "Vinyl",
      "style": "Universal Dart",
      "position": "Fresh Food Door",
      "replaces_part": "W10508993, 2188448A"
    },
    installationSteps: [
      "Ensure refrigerator is unplugged for safety.",
      "Open door and locate the old gasket, which is pressed or screwed into the door.",
      "If screwed in, remove screws carefully around the perimeter and save them.",
      "If pressed in, gently pull the old gasket from its track starting at a corner.",
      "Clean the mounting surface thoroughly with mild soap and water.",
      "For screw-mounted gaskets, align new gasket and reinstall screws.",
      "For press-in gaskets, press the dart of the new gasket into the channel starting at the corners.",
      "Work your way around the door, ensuring the gasket is fully seated.",
      "Close the door to check alignment and seal.",
      "Plug in refrigerator and verify proper cooling."
    ],
    troubleshootingTips: [
      "If gasket won't stay in track, warm it slightly with a hair dryer to make it more pliable.",
      "If door is hard to open, apply a thin film of petroleum jelly to the gasket face.",
      "If condensation still forms on door, check that gasket is making full contact all around.",
      "Some gaskets may take 24-48 hours to fully conform to the door shape."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "WPW10634753",
    name: "Refrigerator Temperature Control Thermostat",
    description: "Replacement temperature control that regulates the cooling cycles in both refrigerator and freezer compartments. Fixes issues with refrigerator being too warm or too cold.",
    price: 78.49,
    originalPrice: 92.99,
    discount: 16,
    category: "refrigerator",
    subcategory: "thermostats",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?thermostat",
    inStock: true,
    stockCount: 27,
    rating: 4.4,
    reviewCount: 413,
    compatibleModels: [
      "WRF535SMBM00", "FGHS2631PF4A", "LFSS2612TE0", 
      "WRS325FDAM04", "FGHC2331PFAA", "WRF535SWHZ"
    ],
    deliveryEstimate: "2-4 business days",
    specifications: {
      "voltage": "120V",
      "temp_range": "30°F to 42°F",
      "connection_type": "Push-On Terminals",
      "replaces_part": "W10225581, 2198202, 2161284"
    },
    installationSteps: [
      "Unplug refrigerator from power source.",
      "Locate the current thermostat (typically inside the fresh food section).",
      "Remove any shelves or drawers necessary for access.",
      "Take a photo of the wire connections for reference.",
      "Carefully disconnect wires from old thermostat.",
      "Remove mounting screws or clips holding thermostat in place.",
      "Install new thermostat in same position and secure.",
      "Reconnect wires to matching terminals on new thermostat.",
      "Replace any shelves or drawers that were removed.",
      "Plug refrigerator back in and set temperature control to medium setting.",
      "Allow 24 hours for temperature to stabilize before adjusting further."
    ],
    troubleshootingTips: [
      "If refrigerator still runs too cold, check that thermostat bulb is properly positioned.",
      "If refrigerator doesn't cool after replacement, check for frost buildup on evaporator coils.",
      "Clicking sound from thermostat area is normal as it cycles on and off.",
      "Allow 24 hours for refrigerator to reach stable temperature after installation."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "W10312695",
    name: "Refrigerator LED Light Board",
    description: "Replacement LED light assembly for refrigerator interior lighting. Fixes issue with refrigerator light not working when door is opened.",
    price: 39.95,
    originalPrice: 48.50,
    discount: 18,
    category: "refrigerator",
    subcategory: "lights and bulbs",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?led+light",
    inStock: true,
    stockCount: 52,
    rating: 4.8,
    reviewCount: 329,
    compatibleModels: [
      "WRF535SMBM00", "WRS325FDAM04", "WRX735SDBM00", 
      "LFSS2612TF0", "FGHS2631PF4A", "WRF535SWHZ"
    ],
    deliveryEstimate: "1-2 business days",
    specifications: {
      "voltage": "120V",
      "wattage": "6W",
      "color": "Warm White",
      "led_count": "6",
      "replaces_part": "W10565137, 2321870, WPW10316490"
    },
    installationSteps: [
      "Unplug refrigerator for safety.",
      "Locate light cover in refrigerator compartment.",
      "Remove light cover by pressing release tabs or removing screws.",
      "Disconnect wire harness from old LED board.",
      "Remove any mounting screws holding LED board in place.",
      "Install new LED board and secure with mounting screws.",
      "Connect wire harness to new LED board.",
      "Replace light cover until it snaps into place.",
      "Plug refrigerator back in and test light by opening door."
    ],
    troubleshootingTips: [
      "If light doesn't work after replacement, check door switch operation.",
      "Verify wire harness is fully seated in connector.",
      "If light flickers, check for loose connections or damaged wiring.",
      "Some models require a reset procedure after light replacement - consult manual."
    ]
  },

  // DISHWASHER PRODUCTS
  {
    id: uuidv4(),
    partNumber: "W10350375",
    name: "Dishwasher Drain Pump Motor Assembly",
    description: "Replacement drain pump used to force water out of the dishwasher during the drain cycle. Fixes dishwashers that aren't draining properly.",
    price: 89.95,
    originalPrice: 104.99,
    discount: 14,
    category: "dishwasher",
    subcategory: "pumps",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?dishwasher+pump",
    inStock: true,
    stockCount: 48,
    rating: 4.6,
    reviewCount: 932,
    compatibleModels: [
      "WDT750SAHZ0", "WDT970SAHZ0", "WDTA50SAHZ0", 
      "JDB1100AWS", "WDF520PADM7", "MDB8959SFZ4"
    ],
    deliveryEstimate: "2-4 business days",
    specifications: {
      "voltage": "120V",
      "motor_type": "Synchronous",
      "connection_type": "Direct Wire",
      "replaces_part": "W10348269, 8558995, W10084573"
    },
    installationSteps: [
      "Disconnect power to the dishwasher and shut off water supply.",
      "Remove the lower access panel and toe kick to access the pump assembly.",
      "Locate the drain pump at the bottom of the dishwasher tub.",
      "Disconnect the electrical connector from the pump.",
      "Twist pump counter-clockwise to remove from housing.",
      "Install new pump by aligning and twisting clockwise until it locks in place.",
      "Reconnect the electrical wiring.",
      "Reinstall the access panel and restore power.",
      "Run a test cycle to verify proper drainage."
    ],
    troubleshootingTips: [
      "If dishwasher still isn't draining after pump replacement, check for clogs in the drain hose.",
      "Unusual noise during draining may indicate debris caught in the pump.",
      "If pump runs continuously, check the float switch for proper operation.",
      "Ensure the drain hose is properly elevated to prevent water from flowing back into the dishwasher."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "W10195840",
    name: "Dishwasher Door Latch Assembly",
    description: "Complete door latch assembly with switches that secure the dishwasher door and allow the dishwasher to operate. Fixes issues with dishwasher not starting or door not latching properly.",
    price: 41.99,
    originalPrice: 48.50,
    discount: 13,
    category: "dishwasher",
    subcategory: "latches",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?dishwasher+latch",
    inStock: true,
    stockCount: 56,
    rating: 4.5,
    reviewCount: 622,
    compatibleModels: [
      "WDT750SAHZ0", "FGID2466QF4A", "KDTE254ESS2", 
      "KDTM354DSS4", "LDF6920ST", "WDF520PADM7"
    ],
    deliveryEstimate: "1-3 business days",
    specifications: {
      "color": "Black/Gray",
      "material": "Plastic/Metal",
      "includes_switches": "Yes",
      "replaces_part": "W10195839, 8193830, WPW10195840"
    },
    installationSteps: [
      "Disconnect power to the dishwasher.",
      "Open dishwasher door and remove inner door panel screws.",
      "Carefully lower the inner door panel to access the latch assembly.",
      "Disconnect wire harnesses from the latch switches.",
      "Remove mounting screws that secure the latch to the door.",
      "Install new latch assembly with existing screws.",
      "Reconnect all wire harnesses to new latch switches.",
      "Reinstall inner door panel and secure with screws.",
      "Restore power and test door latch operation."
    ],
    troubleshootingTips: [
      "If dishwasher won't start after latch replacement, verify all wire connections are secure.",
      "If door doesn't latch properly, check alignment of strike plate on the tub.",
      "Clicking sound without starting could indicate a faulty switch within the latch assembly.",
      "Make sure child lock feature is turned off if the control panel is unresponsive."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "AP5983729",
    name: "Dishwasher Upper Spray Arm",
    description: "Replacement upper spray arm that distributes water throughout the dishwasher to clean the top rack dishes. Resolves issues with dishes not being cleaned properly.",
    price: 34.99,
    originalPrice: 42.25,
    discount: 17,
    category: "dishwasher",
    subcategory: "spray arms",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?dishwasher+spray+arm",
    inStock: true,
    stockCount: 73,
    rating: 4.7,
    reviewCount: 485,
    compatibleModels: [
      "FPHD2491KF0", "WDTA50SAHZ0", "LDF7774ST", 
      "WDT970SAHZ0", "MDB8959SFZ4", "KDTE104DSS0"
    ],
    deliveryEstimate: "1-3 business days",
    specifications: {
      "material": "Plastic",
      "color": "Gray",
      "spray_holes": "22",
      "length": "21 inches",
      "replaces_part": "W10350340, 8561996"
    },
    installationSteps: [
      "Remove dishes and racks from dishwasher.",
      "Remove the top rack by sliding it all the way out and releasing the rail stops.",
      "Locate the upper spray arm underneath the top rack.",
      "Unscrew the retaining nut in the center of the spray arm (usually turns counter-clockwise).",
      "Remove old spray arm and inspect water tube for any debris.",
      "Install new spray arm by aligning with the water tube.",
      "Secure with retaining nut, making sure not to overtighten.",
      "Replace top rack by sliding rails back in and engaging the stops.",
      "Run an empty cycle to test spray arm rotation and water distribution."
    ],
    troubleshootingTips: [
      "If spray arm doesn't rotate, check for food debris blocking the arm movement.",
      "If dishes aren't getting clean in top rack, make sure spray arm holes aren't clogged.",
      "If you hear clicking during operation, ensure spray arm isn't hitting anything as it rotates.",
      "Check that the water pressure is sufficient for proper spray arm operation."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "W10758777",
    name: "Whirlpool Dishwasher Electronic Control Board",
    description: "Replacement main control board that manages all the dishwasher's functions. Fixes dishwashers that won't start or have electronic control issues.",
    price: 129.95,
    originalPrice: 159.99,
    discount: 19,
    category: "dishwasher",
    subcategory: "circuit boards and touch pads",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?circuit+board",
    inStock: true,
    stockCount: 16,
    rating: 4.4,
    reviewCount: 312,
    compatibleModels: [
      "WDT750SAHZ0", "WDTA50SAHZ0", "WDT970SAHZ0", 
      "KDTE254ESS2", "KDTM354DSS4", "WDF520PADM7"
    ],
    deliveryEstimate: "2-5 business days",
    specifications: {
      "voltage": "120V",
      "model_type": "Digital",
      "mounting_style": "Bracket Mount",
      "hardware_included": "Yes",
      "replaces_part": "W10757851, W10712395"
    },
    installationSteps: [
      "Disconnect power to the dishwasher.",
      "Remove outer door panel by removing screws around the perimeter.",
      "Locate the control board - typically mounted on the inside of the door or behind the control panel.",
      "Take a photo of all wire connections before disconnecting.",
      "Carefully disconnect all wire harnesses from the control board.",
      "Remove mounting screws holding the control board in place.",
      "Install new control board in same position and secure with screws.",
      "Reconnect all wire harnesses to matching terminals on new board.",
      "Reinstall outer door panel.",
      "Restore power and test dishwasher operation through all cycles."
    ],
    troubleshootingTips: [
      "If dishwasher doesn't power on after board replacement, check for a blown thermal fuse.",
      "If certain functions don't work, verify all connectors are fully seated on the board.",
      "If control panel lights flicker, check for loose connections or moisture around the board.",
      "Some control boards require programming - consult manual for reset procedures."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "W10300024",
    name: "Dishwasher Water Inlet Valve",
    description: "Replacement water valve that controls water flow into the dishwasher. Fixes dishwashers that won't fill with water or have filling issues.",
    price: 48.95,
    originalPrice: 59.99,
    discount: 18,
    category: "dishwasher",
    subcategory: "valves",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?valve",
    inStock: true,
    stockCount: 42,
    rating: 4.6,
    reviewCount: 528,
    compatibleModels: [
      "WDT750SAHZ0", "WDTA50SAHZ0", "WDT970SAHZ0", 
      "JDB1100AWS", "MDB8959SFZ4", "KDTE104DSS0"
    ],
    deliveryEstimate: "2-3 business days",
    specifications: {
      "voltage": "120V",
      "flow_rate": "0.83 GPM",
      "inlet_size": "3/4 inch",
      "coil_resistance": "750-900 ohms",
      "replaces_part": "W10158389, 8531669, W10316814"
    },
    installationSteps: [
      "Turn off water supply to the dishwasher.",
      "Disconnect power to the dishwasher.",
      "Remove the lower access panel to locate the inlet valve.",
      "Place a towel under the valve to catch any water.",
      "Disconnect the water supply line from the valve.",
      "Remove the mounting screws and brackets securing the valve.",
      "Disconnect the wire harness from the valve solenoid.",
      "Install new valve in same position and secure with mounting hardware.",
      "Reconnect wire harness to the valve.",
      "Reattach water line and tighten securely.",
      "Turn on water supply and check for leaks.",
      "Reinstall access panel and restore power.",
      "Run a test cycle to verify proper filling."
    ],
    troubleshootingTips: [
      "If dishwasher still won't fill, check that water supply valve is fully open.",
      "If valve leaks, ensure supply line is properly connected and not cross-threaded.",
      "If valve makes buzzing noise but doesn't fill, check water pressure (should be 20-120 PSI).",
      "Some valves have a screen filter that can be cleaned if clogged."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "W10567650",
    name: "Dishwasher Heating Element",
    description: "Replacement heating element that heats water during wash cycle and provides heat for drying. Fixes dishwashers not drying dishes properly or not heating water.",
    price: 54.99,
    originalPrice: 67.50,
    discount: 19,
    category: "dishwasher",
    subcategory: "elements and burners",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?heating+element",
    inStock: true,
    stockCount: 38,
    rating: 4.5,
    reviewCount: 473,
    compatibleModels: [
      "WDT750SAHZ0", "WDTA50SAHZ0", "WDT970SAHZ0", 
      "KDTM354DSS4", "MDB8959SFZ4", "WDF520PADM7"
    ],
    deliveryEstimate: "2-4 business days",
    specifications: {
      "wattage": "650W",
      "voltage": "120V",
      "resistance": "15-25 ohms",
      "length": "22 inches",
      "replaces_part": "W10518394, 8194018, WPW10518394"
    },
    installationSteps: [
      "Disconnect power to the dishwasher.",
      "Remove lower dish rack to access the heating element.",
      "Locate the heating element at the bottom of the dishwasher tub.",
      "Remove any debris or buildup from the area.",
      "Locate the wire terminals on both ends of the heating element.",
      "Take a photo for reference before disconnecting wires.",
      "Remove the mounting nuts securing the element to the tub.",
      "Gently pull the element free from the tub.",
      "Install new heating element by pushing terminals through holes in the tub.",
      "Secure with mounting nuts on both ends.",
      "Reconnect the wire terminals to the appropriate connections.",
      "Verify the element is properly seated and not contacting any plastic parts.",
      "Replace lower dish rack.",
      "Restore power and run a test cycle to verify heating."
    ],
    troubleshootingTips: [
      "If dishes still aren't drying, check rinse aid dispenser and settings.",
      "If element doesn't heat, test with multimeter for proper resistance (15-25 ohms).",
      "Burning smell could indicate element is touching plastic components.",
      "If dishwasher trips breaker during drying cycle, element may have a short circuit."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "W10482550",
    name: "Dishwasher Detergent Dispenser",
    description: "Replacement detergent and rinse aid dispenser assembly. Fixes issues with detergent not dispensing during wash cycle.",
    price: 59.95,
    originalPrice: 72.99,
    discount: 18,
    category: "dishwasher",
    subcategory: "dispensers",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?dispenser",
    inStock: true,
    stockCount: 29,
    rating: 4.3,
    reviewCount: 387,
    compatibleModels: [
      "WDT750SAHZ0", "WDTA50SAHZ0", "WDT970SAHZ0", 
      "KDTE254ESS2", "MDB8959SFZ4", "WDF520PADM7"
    ],
    deliveryEstimate: "2-3 business days",
    specifications: {
      "color": "White",
      "material": "Plastic",
      "includes_rinse_aid": "Yes",
      "wax_motor": "Yes",
      "replaces_part": "W10224675, 8558837, WPW10224675"
    },
    installationSteps: [
      "Disconnect power to the dishwasher.",
      "Open the dishwasher door and locate the dispenser on the inner door panel.",
      "Remove screws securing the dispenser to the door panel.",
      "Disconnect any wire harnesses connected to the dispenser.",
      "Remove the old dispenser assembly.",
      "Clean the mounting surface thoroughly.",
      "Install new dispenser and secure with mounting screws.",
      "Reconnect any wire harnesses to the new dispenser.",
      "Close door and restore power.",
      "Add detergent and rinse aid to test functionality."
    ],
    troubleshootingTips: [
      "If dispenser door doesn't open during cycle, check for mechanical obstructions.",
      "If dispenser leaks rinse aid, check that the fill cap is tight and not cracked.",
      "If detergent cakes in dispenser, ensure hot water is reaching the dishwasher.",
      "Some dispensers have adjustable rinse aid settings - consult manual for proper levels."
    ]
  },
  {
    id: uuidv4(),
    partNumber: "WP8268743",
    name: "Dishwasher Filter Assembly",
    description: "Replacement filter system that traps food particles during the wash cycle. Fixes dishwashers with poor cleaning performance due to clogged filters.",
    price: 28.95,
    originalPrice: 34.99,
    discount: 17,
    category: "dishwasher",
    subcategory: "filters",
    brand: "Whirlpool",
    imageUrl: "https://source.unsplash.com/300x300/?dishwasher+filter",
    inStock: true,
    stockCount: 87,
    rating: 4.8,
    reviewCount: 426,
    compatibleModels: [
      "WDT750SAHZ0", "WDTA50SAHZ0", "WDT970SAHZ0", 
      "KDTM354DSS4", "MDB8959SFZ4", "JDB1100AWS"
    ],
    deliveryEstimate: "1-3 business days",
    specifications: {
      "filter_type": "Manual Clean",
      "material": "Plastic/Stainless Steel Mesh",
      "components": "Coarse and Fine Filters",
      "replaces_part": "W10807920, 8562080, WPW10807920"
    },
    installationSteps: [
      "Open dishwasher and remove bottom rack.",
      "Locate the filter assembly at the bottom of the dishwasher tub.",
      "Remove the old filter by turning counter-clockwise and lifting out.",
      "Clean the filter housing area of any debris.",
      "Insert new filter into housing and align properly.",
      "Turn clockwise to lock the filter in place.",
      "Replace the bottom rack.",
      "Run a rinse cycle to ensure proper installation."
    ],
    troubleshootingTips: [
      "Regular cleaning of the filter (every 1-3 months) will improve dishwasher performance.",
      "If dishes still have food particles after cleaning, ensure filter is properly locked in place.",
      "Soaking dirty filter in warm, soapy water can help remove stubborn debris.",
      "Some models have multiple filter components - be sure to clean all parts."
    ]
  }
];

