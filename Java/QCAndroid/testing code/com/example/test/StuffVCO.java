package com.example.test;

import java.util.HashMap;

import org.quickconnectfamily.ControlObject;
import org.quickconnectfamily.QC;

public class StuffVCO implements ControlObject {

	@Override
	public Boolean handleIt(HashMap<Object, Object> parameters) {
		System.out.println("ui thread: "+Thread.currentThread().getId());
		Thing aThing = (Thing)parameters.get("stuff");
		Double origNum = (Double)parameters.get("num");
		Double modified = (Double)parameters.get("modified");
		System.out.println("the thing is: "+aThing.getName()+" orig: "+origNum+" mod: "+modified);
		return QC.STACK_EXIT;
	}

}
