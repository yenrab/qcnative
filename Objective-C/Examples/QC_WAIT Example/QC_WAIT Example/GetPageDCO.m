//
//  getPageDCO.m
//  QC_WAIT Example
//
//  Created by Lee Barney on 9/18/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import "GetPageDCO.h"
#import "WebLoadListener.h"
#import <Foundation/Foundation.h>

@implementation GetPageDCO
//override handleIt
+(QCReturnValue)handleIt:(NSMutableDictionary *)parameters{
    NSString *urlAsString = [parameters objectForKey:@"url string"];
    UIWebView *theWebView = [parameters objectForKey:@"web view"];
    NSURL *theURL = [NSURL URLWithString:urlAsString];
    NSURLRequest *aRequest = [NSURLRequest requestWithURL:theURL];
    QCRequestHandler *theHandler = [parameters objectForKey:@"qcrequest handler"];
    theWebView.delegate = [[WebLoadListener alloc] initWithRequestHandler:theHandler];
    [theWebView loadRequest:aRequest];
    return QC_STACK_WAIT;
}
@end
