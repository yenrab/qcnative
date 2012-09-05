package com.example.test;

import java.util.HashMap;

import org.quickconnectfamily.ControlObject;
import org.quickconnectfamily.QC;

public class StuffECO implements ControlObject {

	@Override
	public Boolean handleIt(HashMap<Object, Object> parameters) {
		System.out.println("Something was missing: "+parameters);
		return QC.STACK_EXIT;
	}

}
