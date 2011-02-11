/*
 Copyright (c) 2008, 2009 Lee Barney
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.
 
 The end-user documentation included with the redistribution, if any, must 
 include the following acknowledgment: 
 "This product was created using the QuickConnect framework.  http://quickconnect.sourceforge.net/", 
 in the same place and form as other third-party acknowledgments.   Alternately, this acknowledgment 
 may appear in the software itself, in the same form and location as other 
 such third-party acknowledgments.
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 
 */
package org.quickconnect;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;

public class QCRequestHandler implements Runnable {
	private String command;
	private ArrayList<Object> parameters;
	private boolean isAndroid = true;
	private boolean isEnterprise = true;
	private android.os.Handler theHandler;
	
	
	public QCRequestHandler(String command, ArrayList<Object> parameters, android.os.Handler aHandler){
		this.command = command;
		this.parameters = parameters;
		theHandler = aHandler;
		try{
			Class.forName("android.os.Looper");
		}
		catch(Exception e){
			isAndroid = false;
		}
		try{
			Class.forName("javax.servlet.GenericServlet");
		}
		catch(Exception e){
			isEnterprise = false;
		}
	}
	
	public void run() {
		if(checkValidation(command, parameters)){
			final ArrayList<Object> newParameters = dispatchToBCO(command, parameters);
			if(!isEnterprise){
				if(isAndroid){
					final QCRequestHandler self = this;
					theHandler.post(new Runnable(){
						  public void run() {
							self.dispatchToVCO(command, newParameters);
						  }
					});
				}
				else{
					//must be JavaSE
					try {
						Class swingUtilsClass = Class.forName("javax.swing.SwingUtilities");
						Method laterMethod = swingUtilsClass.getDeclaredMethod("invokeLater", Runnable.class);

						laterMethod.invoke(null,new Runnable() {
						    public void run() {
						    	dispatchToVCO(command, newParameters);
						    }
						  });
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
			else{
				//running in enterprise environment
				dispatchToVCO(command, newParameters);
			}
		}
	}
	
	private boolean checkValidation(String command, ArrayList<Object> parameters){
		Boolean result = true;
		try{
			ArrayList<ControlObject> COList = QuickConnect.getValidationMap().get(command);
			if(COList != null){
				int numValCOs = COList.size();
				for(int i = 0; i < numValCOs; i++){
					try {
						ControlObject handler = COList.get(i);
						result = (Boolean)handler.handleIt(parameters);
						if(result == false){
							break;
						}
					} catch (Exception e) {
						result = false;
						break;
					}
				}
			}
		}
		catch(Exception e){
			result = false;
		}
		return result;
	}
	
	private ArrayList<Object> dispatchToBCO(String command, ArrayList<Object> parameters){
		return dispatchToHandlers(QuickConnect.getBusinessMap(), command, parameters);
	}
	
	private ArrayList<Object> dispatchToVCO(String command, ArrayList<Object> parameters){
		ArrayList<Object> retVal = (ArrayList<Object>)dispatchToHandlers(QuickConnect.getViewMap(), command, parameters);
		return retVal;
	}
	public ArrayList<Object> dispatchToECO(String command, ArrayList<Object> parameters){
		
		if(!isEnterprise){
			if(isAndroid){
					final QCRequestHandler self = this;
					final String aCommand = command;
					final ArrayList<Object> newParameters = parameters;
					theHandler.post(new Runnable(){
						  public void run() {
							  Object result = (ArrayList<Object>)self.dispatchToHandlers(QuickConnect.getErrorMap(), aCommand, newParameters);
						  }
					});
			}
			else{
				//must be JavaSE
				try {
					final String aCommand = command;
					final ArrayList<Object> someParameters = parameters;
					Class swingUtilsClass = Class.forName("javax.swing.SwingUtilities");
					Method laterMethod = swingUtilsClass.getDeclaredMethod("invokeLater", swingUtilsClass);
					//Object[] params = new Object[1];
					//params[0] = 
					laterMethod.invoke(null, new Runnable() {
					    public void run() {
					    	Object result = (ArrayList<Object>)dispatchToHandlers(QuickConnect.getErrorMap(), aCommand, someParameters);
					    }
					  });
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		else{
			//running in enterprise environment
			Object result = (ArrayList<Object>)dispatchToHandlers(QuickConnect.getErrorMap(), command, parameters);
		}
		return new ArrayList<Object>();
	}
	
	private ArrayList<Object> dispatchToHandlers(HashMap<String, ArrayList<ControlObject> > map, String command, ArrayList<Object> parameters){
		//Log.d(QuickConnect.LOG_TAG, "handling command "+command);
		ArrayList<Object> resultData = new ArrayList<Object>();
		if(parameters != null){
			resultData.addAll(parameters);
		}
		ArrayList<ControlObject> COList = map.get(command);
		if(COList != null){
			int numCOs = COList.size();
			for(int i = 0; i < numCOs; i++){
				Object result = null;
				Object handler = null;
				handler = COList.get(i);
				if(handler != null){
					try {
						result = ((ControlObject)handler).handleIt(resultData);
					} 
					catch (Exception e) {
						String message = handler.getClass().getCanonicalName()+"'s handleIt method threw an exception.  "+e.getCause();
						if(e.getMessage() != null){
							message = e.getMessage();
							System.out.println(message);
						}
					}
				}if(result != null){
					resultData.add(result);
				}
			}
		}
		return resultData;
	}
	
}
