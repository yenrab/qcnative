package com.example.test;

import java.util.HashMap;
import java.util.concurrent.locks.Condition;

import org.quickconnectfamily.StackWaitMonitor;

public class SimulatedAsyncBehavior implements Runnable {

	HashMap<Object,Object>parameters;
	
	public SimulatedAsyncBehavior(HashMap<Object, Object> parameters) {
		super();
		this.parameters = parameters;
	}



	@Override
	public void run() {
		
		try {
			System.out.println("simulate waiting on some fake background task. "+Thread.currentThread().getName());
			Thread.sleep(5000);
			StackWaitMonitor stackMonitor = (StackWaitMonitor) parameters.get("stackMonitor");
			stackMonitor.continueStack();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
