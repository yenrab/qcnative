package com.example.test;

import java.util.HashMap;

import org.quickconnectfamily.ControlObject;
import org.quickconnectfamily.QC;

public class AsyncDCO implements ControlObject {

	@Override
	public int handleIt(HashMap<Object, Object> parameters) {
		System.out.println("handling async"+Thread.currentThread().getName());
		new Thread(new SimulatedAsyncBehavior(parameters)).start();
		return QC.STACK_WAIT;
	}

}
