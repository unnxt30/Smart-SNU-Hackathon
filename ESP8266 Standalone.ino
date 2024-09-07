/* Comment this out to disable prints and save space */
#define BLYNK_PRINT Serial

/* Fill in information from Blynk Device Info here */
#define BLYNK_AUTH_TOKEN            "eSiBwk1UBlCfLApiIVTrRXOmHKbm1wU3"
#define BLYNK_TEMPLATE_ID           "TMPL3sx7y6kfJ"
#define BLYNK_TEMPLATE_NAME         "Indira"

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

// Your WiFi credentials.
// Set password to "" for open networks.
char ssid[] = "PandaEdge30";
char password[] = "coldspot";

// This function creates the timer object. It's part of Blynk library 
BlynkTimer timer; 

#include <DHT11.h>
#define AOUT_PIN A0 // Arduino pin that connects to AOUT pin of moisture sensor
#define THRESHOLD 900 // CHANGE YOUR THRESHOLD HERE
#define DHT11PIN 16
#define SERVO 2

DHT11 dht11(DHT11PIN);
// Define pins for the RGB LED
const int redPin = 0;
const int greenPin = 4;
const int bluePin = 5;

int soil;
int temperature;
int humidity;

int result;

bool color = false;

// Function to set the color of the RGB LED
void setColor(int redValue, int greenValue, int blueValue) {
  // Set the color by adjusting the PWM outputs
  analogWrite(redPin, redValue);
  analogWrite(greenPin, greenValue);
  analogWrite(bluePin, blueValue);
}

void myTimer() 
{

  color = !color;

  if (color) {
    setColor(0, 255, 0);
  } else {
    setColor(0, 0, 255);
  }

  if (result == 0) {
    Blynk.virtualWrite(V0, soil);
    Blynk.virtualWrite(V1, temperature);
    Blynk.virtualWrite(V2, humidity);
  }

  if (result == 0) {
    Serial.print("/");
    Serial.print(soil);
    Serial.print("|");
    Serial.print(temperature);
    Serial.print("|");
    Serial.print(humidity);
    Serial.print("\\");
  } else {
    Serial.print("/");
    Serial.print(soil);
    Serial.print("\\");
  }

}

void setup()
{
  // Debug console
  Serial.begin(9600);

  Serial.println("Starting...");

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(SERVO, OUTPUT);

  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  int precipChance = 0;
  Serial.println(precipChance);


  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);

  // Setting interval to send data to Blynk Cloud to 1000ms. 
  // It means that data will be sent every second
  timer.setInterval(250L, myTimer);   

}

void loop()
{
  soil = analogRead(AOUT_PIN); // read the analog value from sensor

  if (soil > THRESHOLD) {
    // Soil is DRY, turn on the LED, Motor
    digitalWrite(LED_BUILTIN, LOW);
    digitalWrite(SERVO, HIGH);

  } else {
    // Soil is WET, display blue
    digitalWrite(LED_BUILTIN, HIGH);
    digitalWrite(SERVO, LOW);
  }

  // Attempt to read the temperature and humidity values from the DHT11 sensor.
  result = dht11.readTemperatureHumidity(temperature, humidity);

  Blynk.run();

  timer.run();
}



