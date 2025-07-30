package com.yorku4413s25.leafwheels.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.lexmodelsv2.LexModelsV2Client;
import software.amazon.awssdk.services.lexmodelsv2.model.*;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LexBotSetupService {

    @Value("${AWS_LEX_BOT_ID}")
    private String botId;

    @Value("${AWS_LEX_LOCALE_ID:en_US}")
    private String localeId;

    @Value("${AWS_REGION:us-east-1}")
    private String awsRegion;

    @Value("${chatbot.auto-setup:true}")
    private boolean autoSetup;

    @Value("${use-iam-roles:false}")
    private boolean useIamRoles;

    @Value("${AWS_ACCESS_KEY_ID:}")
    private String accessKeyId;

    @Value("${AWS_SECRET_ACCESS_KEY:}")
    private String secretAccessKey;

    private LexModelsV2Client lexClient;

    @EventListener(ApplicationReadyEvent.class)
    public void setupBotComponents() {
        if (!autoSetup) {
            log.info("Auto bot setup is disabled");
            return;
        }

        try {
            initializeLexClient();
            createSlotTypes();
            createIntents();
            createSlots();
            log.info("Lex bot setup completed successfully");
        } catch (Exception e) {
            log.error("Failed to setup Lex bot components: {}", e.getMessage(), e);
        }
    }

    private void initializeLexClient() {
        if (useIamRoles) {
            log.info("Using IAM roles for AWS authentication");
            this.lexClient = LexModelsV2Client.builder()
                    .region(Region.of(awsRegion))
                    .build();
        } else if (accessKeyId != null && !accessKeyId.isEmpty() && 
                   secretAccessKey != null && !secretAccessKey.isEmpty()) {
            log.info("Using access keys for AWS authentication");
            this.lexClient = LexModelsV2Client.builder()
                    .region(Region.of(awsRegion))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKeyId, secretAccessKey)))
                    .build();
        } else {
            log.info("Using default credential provider chain");
            this.lexClient = LexModelsV2Client.builder()
                    .region(Region.of(awsRegion))
                    .build();
        }
    }

    private void createSlotTypes() {
        createVehicleMakeSlotType();
        createPriceRangeSlotType();
    }

    private void createVehicleMakeSlotType() {
        try {
            try {
                DescribeSlotTypeRequest describeRequest = DescribeSlotTypeRequest.builder()
                        .botId(botId)
                        .botVersion("DRAFT")
                        .localeId(localeId)
                        .slotTypeId("VehMake")  // Shortened to meet 10 char limit
                        .build();
                lexClient.describeSlotType(describeRequest);
                log.info("VehMake slot type already exists");
                return;
            } catch (ResourceNotFoundException e) {

            }

            List<SlotTypeValue> vehicleMakeValues = Arrays.asList(
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("Tesla").build())
                    .synonyms(
                        SampleValue.builder().value("TESLA").build(),
                        SampleValue.builder().value("tesla").build(),
                        SampleValue.builder().value("Model S").build(),
                        SampleValue.builder().value("Model 3").build(),
                        SampleValue.builder().value("Model X").build(),
                        SampleValue.builder().value("Model Y").build()
                    )
                    .build(),
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("BMW").build())
                    .synonyms(
                        SampleValue.builder().value("bmw").build(),
                        SampleValue.builder().value("Bmw").build(),
                        SampleValue.builder().value("i3").build(),
                        SampleValue.builder().value("i4").build(),
                        SampleValue.builder().value("iX").build()
                    )
                    .build(),
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("Nissan").build())
                    .synonyms(
                        SampleValue.builder().value("nissan").build(),
                        SampleValue.builder().value("NISSAN").build(),
                        SampleValue.builder().value("Leaf").build(),
                        SampleValue.builder().value("Ariya").build()
                    )
                    .build(),
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("Chevrolet").build())
                    .synonyms(
                        SampleValue.builder().value("Chevy").build(),
                        SampleValue.builder().value("chevrolet").build(),
                        SampleValue.builder().value("chevy").build(),
                        SampleValue.builder().value("Bolt").build(),
                        SampleValue.builder().value("Volt").build()
                    )
                    .build(),
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("Ford").build())
                    .synonyms(
                        SampleValue.builder().value("ford").build(),
                        SampleValue.builder().value("FORD").build(),
                        SampleValue.builder().value("Mustang Mach-E").build(),
                        SampleValue.builder().value("F-150 Lightning").build()
                    )
                    .build()
            );

            CreateSlotTypeRequest request = CreateSlotTypeRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .slotTypeName("VehMake")  // Shortened to meet 10 char limit
                    .description("Vehicle make names")
                    .slotTypeValues(vehicleMakeValues)
                    .valueSelectionSetting(SlotValueSelectionSetting.builder()
                            .resolutionStrategy(SlotValueResolutionStrategy.ORIGINAL_VALUE)
                            .build())
                    .build();

            CreateSlotTypeResponse response = lexClient.createSlotType(request);
            log.info("Created VehMake slot type: {}", response.slotTypeId());
        } catch (Exception e) {
            log.error("Failed to create VehMake slot type: {}", e.getMessage());
        }
    }

    private void createPriceRangeSlotType() {
        try {
            try {
                DescribeSlotTypeRequest describeRequest = DescribeSlotTypeRequest.builder()
                        .botId(botId)
                        .botVersion("DRAFT")
                        .localeId(localeId)
                        .slotTypeId("PriceRange")  // Already within 10 char limit
                        .build();
                lexClient.describeSlotType(describeRequest);
                log.info("PriceRange slot type already exists");
                return;
            } catch (ResourceNotFoundException e) {
            }

            List<SlotTypeValue> priceRangeValues = Arrays.asList(
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("under 20000").build())
                    .synonyms(
                        SampleValue.builder().value("less than 20k").build(),
                        SampleValue.builder().value("below 20000").build(),
                        SampleValue.builder().value("under 20k").build()
                    )
                    .build(),
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("20000 to 40000").build())
                    .synonyms(
                        SampleValue.builder().value("20k to 40k").build(),
                        SampleValue.builder().value("between 20000 and 40000").build(),
                        SampleValue.builder().value("20-40k").build()
                    )
                    .build(),
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("40000 to 60000").build())
                    .synonyms(
                        SampleValue.builder().value("40k to 60k").build(),
                        SampleValue.builder().value("between 40000 and 60000").build(),
                        SampleValue.builder().value("40-60k").build()
                    )
                    .build(),
                SlotTypeValue.builder()
                    .sampleValue(SampleValue.builder().value("over 60000").build())
                    .synonyms(
                        SampleValue.builder().value("above 60k").build(),
                        SampleValue.builder().value("more than 60000").build(),
                        SampleValue.builder().value("over 60k").build()
                    )
                    .build()
            );

            CreateSlotTypeRequest request = CreateSlotTypeRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .slotTypeName("PriceRange")
                    .description("Price ranges for vehicle search")
                    .slotTypeValues(priceRangeValues)
                    .valueSelectionSetting(SlotValueSelectionSetting.builder()
                            .resolutionStrategy(SlotValueResolutionStrategy.ORIGINAL_VALUE)
                            .build())
                    .build();

            CreateSlotTypeResponse response = lexClient.createSlotType(request);
            log.info("Created PriceRange slot type: {}", response.slotTypeId());
        } catch (Exception e) {
            log.error("Failed to create PriceRange slot type: {}", e.getMessage());
        }
    }

    private void createIntents() {
        createSearchVehiclesIntent();
        createGetCartInfoIntent();
        createAddToCartIntent();
        createGetHelpIntent();
    }
    
    private boolean intentExists(String intentName) {
        try {
            ListIntentsRequest request = ListIntentsRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .build();

            ListIntentsResponse response = lexClient.listIntents(request);
            return response.intentSummaries().stream()
                    .anyMatch(intent -> intentName.equals(intent.intentName()));
        } catch (Exception e) {
            log.error("Failed to check if intent exists: {}", e.getMessage());
            return false;
        }
    }

    private void createSearchVehiclesIntent() {
        try {
            if (intentExists("SearchVeh")) {
                log.info("SearchVeh intent already exists");
                return;
            }

            List<SampleUtterance> utterances = Arrays.asList(
                SampleUtterance.builder().utterance("I want to buy a {make} car").build(),
                SampleUtterance.builder().utterance("Show me {make} vehicles").build(),
                SampleUtterance.builder().utterance("I'm looking for a car under {price}").build(),
                SampleUtterance.builder().utterance("Find me electric vehicles from {make}").build(),
                SampleUtterance.builder().utterance("I need a car in the {price} range").build(),
                SampleUtterance.builder().utterance("Show me vehicles").build(),
                SampleUtterance.builder().utterance("I want to buy a car").build(),
                SampleUtterance.builder().utterance("Find me a vehicle").build()
            );

            CreateIntentRequest request = CreateIntentRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .intentName("SearchVeh")  // Shortened to meet 10 char limit
                    .description("Search for vehicles by make and price")
                    .sampleUtterances(utterances)
                    .fulfillmentCodeHook(FulfillmentCodeHookSettings.builder()
                            .enabled(true)
                            .build())
                    .build();

            CreateIntentResponse response = lexClient.createIntent(request);
            log.info("Created SearchVehicles intent: {}", response.intentId());
        } catch (Exception e) {
            log.error("Failed to create SearchVehicles intent: {}", e.getMessage());
        }
    }

    private void createGetCartInfoIntent() {
        try {
            if (intentExists("CartInfo")) {
                log.info("CartInfo intent already exists");
                return;
            }
            
            List<SampleUtterance> utterances = Arrays.asList(
                SampleUtterance.builder().utterance("What's in my cart").build(),
                SampleUtterance.builder().utterance("Show me my cart").build(),
                SampleUtterance.builder().utterance("What items do I have").build(),
                SampleUtterance.builder().utterance("Cart status").build(),
                SampleUtterance.builder().utterance("My shopping cart").build()
            );

            CreateIntentRequest request = CreateIntentRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .intentName("CartInfo")  // Shortened to meet 10 char limit
                    .description("Get information about user's cart")
                    .sampleUtterances(utterances)
                    .fulfillmentCodeHook(FulfillmentCodeHookSettings.builder()
                            .enabled(true)
                            .build())
                    .build();

            CreateIntentResponse response = lexClient.createIntent(request);
            log.info("Created CartInfo intent: {}", response.intentId());
        } catch (Exception e) {
            log.error("Failed to create CartInfo intent: {}", e.getMessage());
        }
    }

    private void createAddToCartIntent() {
        try {  
            if (intentExists("AddCart")) {
                log.info("AddCart intent already exists");
                return;
            }
            
            List<SampleUtterance> utterances = Arrays.asList(
                SampleUtterance.builder().utterance("Add this to my cart").build(),
                SampleUtterance.builder().utterance("I want to buy this vehicle").build(),
                SampleUtterance.builder().utterance("Add to cart").build(),
                SampleUtterance.builder().utterance("Purchase this car").build(),
                SampleUtterance.builder().utterance("I'll take it").build()
            );

            CreateIntentRequest request = CreateIntentRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .intentName("AddCart")  // Shortened to meet 10 char limit
                    .description("Add items to shopping cart")
                    .sampleUtterances(utterances)
                    .fulfillmentCodeHook(FulfillmentCodeHookSettings.builder()
                            .enabled(true)
                            .build())
                    .build();

            CreateIntentResponse response = lexClient.createIntent(request);
            log.info("Created AddCart intent: {}", response.intentId());
        } catch (Exception e) {
            log.error("Failed to create AddCart intent: {}", e.getMessage());
        }
    }

    private void createGetHelpIntent() {
        try {
            if (intentExists("Help")) {
                log.info("Help intent already exists");
                return;
            }
            
            List<SampleUtterance> utterances = Arrays.asList(
                SampleUtterance.builder().utterance("Help").build(),
                SampleUtterance.builder().utterance("What can you do").build(),
                SampleUtterance.builder().utterance("How can you help me").build(),
                SampleUtterance.builder().utterance("What are my options").build(),
                SampleUtterance.builder().utterance("I need assistance").build()
            );

            CreateIntentRequest request = CreateIntentRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .intentName("Help")  // Shortened to meet 10 char limit
                    .description("Provide help and assistance")
                    .sampleUtterances(utterances)
                    .fulfillmentCodeHook(FulfillmentCodeHookSettings.builder()
                            .enabled(true)
                            .build())
                    .build();

            CreateIntentResponse response = lexClient.createIntent(request);
            log.info("Created Help intent: {}", response.intentId());
        } catch (Exception e) {
            log.error("Failed to create Help intent: {}", e.getMessage());
        }
    }

    private void createSlots() {
        createMakeSlot();
        createPriceSlot();
    }

    private void createMakeSlot() {
        try {
            String searchVehiclesIntentId = getIntentId("SearchVeh");
            String vehicleMakeSlotTypeId = getSlotTypeId("VehMake");

            if (searchVehiclesIntentId == null || vehicleMakeSlotTypeId == null) {
                log.warn("Cannot create make slot - missing intent or slot type");
                return;
            }

            CreateSlotRequest request = CreateSlotRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .intentId(searchVehiclesIntentId)
                    .slotName("make")
                    .slotTypeId(vehicleMakeSlotTypeId)
                    .valueElicitationSetting(SlotValueElicitationSetting.builder()
                            .slotConstraint(SlotConstraint.OPTIONAL)
                            .promptSpecification(PromptSpecification.builder()
                                    .messageGroups(
                                        MessageGroup.builder()
                                            .message(Message.builder()
                                                .plainTextMessage(PlainTextMessage.builder()
                                                    .value("What car brand are you interested in?")
                                                    .build())
                                                .build())
                                            .build()
                                    )
                                    .maxRetries(2)
                                    .build())
                            .build())
                    .build();

            CreateSlotResponse response = lexClient.createSlot(request);
            log.info("Created make slot: {}", response.slotId());
        } catch (Exception e) {
            log.error("Failed to create make slot: {}", e.getMessage());
        }
    }

    private void createPriceSlot() {
        try {
            String searchVehiclesIntentId = getIntentId("SearchVeh");
            String priceRangeSlotTypeId = getSlotTypeId("PriceRange");

            if (searchVehiclesIntentId == null || priceRangeSlotTypeId == null) {
                log.warn("Cannot create price slot - missing intent or slot type");
                return;
            }

            CreateSlotRequest request = CreateSlotRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .intentId(searchVehiclesIntentId)
                    .slotName("price")
                    .slotTypeId(priceRangeSlotTypeId)
                    .valueElicitationSetting(SlotValueElicitationSetting.builder()
                            .slotConstraint(SlotConstraint.OPTIONAL)
                            .promptSpecification(PromptSpecification.builder()
                                    .messageGroups(
                                        MessageGroup.builder()
                                            .message(Message.builder()
                                                .plainTextMessage(PlainTextMessage.builder()
                                                    .value("What's your budget range?")
                                                    .build())
                                                .build())
                                            .build()
                                    )
                                    .maxRetries(2)
                                    .build())
                            .build())
                    .build();

            CreateSlotResponse response = lexClient.createSlot(request);
            log.info("Created price slot: {}", response.slotId());
        } catch (Exception e) {
            log.error("Failed to create price slot: {}", e.getMessage());
        }
    }

    private String getIntentId(String intentName) {
        try {
            ListIntentsRequest request = ListIntentsRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .build();

            ListIntentsResponse response = lexClient.listIntents(request);
            return response.intentSummaries().stream()
                    .filter(intent -> intentName.equals(intent.intentName()))
                    .map(IntentSummary::intentId)
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Failed to get intent ID for {}: {}", intentName, e.getMessage());
            return null;
        }
    }

    private String getSlotTypeId(String slotTypeName) {
        try {
            ListSlotTypesRequest request = ListSlotTypesRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .build();

            ListSlotTypesResponse response = lexClient.listSlotTypes(request);
            return response.slotTypeSummaries().stream()
                    .filter(slotType -> slotTypeName.equals(slotType.slotTypeName()))
                    .map(SlotTypeSummary::slotTypeId)
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Failed to get slot type ID for {}: {}", slotTypeName, e.getMessage());
            return null;
        }
    }

    public void buildBot() {
        try {
            BuildBotLocaleRequest request = BuildBotLocaleRequest.builder()
                    .botId(botId)
                    .botVersion("DRAFT")
                    .localeId(localeId)
                    .build();

            BuildBotLocaleResponse response = lexClient.buildBotLocale(request);
            log.info("Bot build initiated successfully");
        } catch (Exception e) {
            log.error("Failed to build bot: {}", e.getMessage());
        }
    }
}
