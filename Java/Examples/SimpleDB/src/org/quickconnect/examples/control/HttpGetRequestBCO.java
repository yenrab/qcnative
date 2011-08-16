package org.quickconnect.examples.control;

import java.net.URL;
import java.util.HashMap;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.quickconnect.ControlObject;
import org.quickconnect.QC;
import org.quickconnect.QuickConnect;

public class HttpGetRequestBCO implements ControlObject {

	public Object handleIt(HashMap<String,Object> parameters) {
		System.out.println("getting page");
		URL checkedURL = (URL)parameters.get("validURL");
		HttpClient httpclient = new DefaultHttpClient();
		String html = null;
		try {
			HttpGet httpget = new HttpGet(checkedURL.toURI());
			HttpResponse response = httpclient.execute(httpget);
			HttpEntity responseEntity = response.getEntity();
			if (responseEntity != null) {
				html = EntityUtils.toString(responseEntity, HTTP.UTF_8);
			}
			parameters.put("GETResult", html);
		} catch (Exception e) {
			parameters.put("error",e);
		}
		finally {
			httpclient.getConnectionManager().shutdown();
		}
		if(html == null){
			QuickConnect.handleError("getRequestFailure", parameters);
			return QC.EXIT_STACK;
		}
		return QC.CONTINUE_STACK;
	}

}
