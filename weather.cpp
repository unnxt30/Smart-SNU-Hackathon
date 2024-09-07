#include <iostream>
#include <string>
#include <curl/curl.h>

using namespace std;

size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* response) {
    size_t totalSize = size * nmemb;
    response->append((char*)contents, totalSize);
    return totalSize;
}


int main() {

	string apiKey = "Hf3SV7oAZwE82zAdnrjIEKQNDaTxfEJh";
	string locationKey = "191264";
	string url = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=Hf3SV7oAZwE82zAdnrjIEKQNDaTxfEJh&q=Dadri&language=en-us&details=true";

	CURL* curl = curl_easy_init();
	CURLcode res;
	string responseString;	

	if(curl){

		curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

        	// Specify the callback function to handle the API response
        	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);

        	// Specify the user-defined string to receive the response
        	curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseString);

        	// Perform the request
        	res = curl_easy_perform(curl);

        	// Check for errors
        	if (res != CURLE_OK) {
        	    std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;
        	} else {
        	    std::cout << "API Response: " << responseString << std::endl;
        	}

        	// Clean up
        	curl_easy_cleanup(curl);
		
	}

	curl_global_cleanup();
}

